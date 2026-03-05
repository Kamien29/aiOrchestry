import React, { useState } from "react";

export default function App() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const agents = [
    {
      name: "Militarny",
      system: "Jesteś wojskowym instruktorem. Pisz rozkazującym stylem.",
    },
    {
      name: "Cywilny",
      system: "Jesteś domowym kucharzem. Pisz spokojnie",
    },
    {
      name: "Morski",
      system: "Jesteś kucharzem na statku.",
    },
    {
      name: "Lądowy",
      system: "Jesteś kucharzem polowym.",
    },
    {
      name: "Wywiad",
      system: "Jesteś analitykiem wywiadu opisującym operację.",
    },
    {
      name: "Neutralny",
      system: "Jesteś neutralnym asystentem kuchennym.",
    },
  ];

  async function runAgents() {
    setError(null);
    setLoading(true);
    setSteps([]);
    
    try {
      for (let i = 0; i < agents.length; i++) {
        const previousSteps = steps

  .map((s, idx) => `${idx + 1}. ${s}`)
  .join("\n");


  const prompt = `
Napisz poprawną polszczyzną tylko jeden krok przepisu na ciasto orzechowe.
To jest krok numer ${i + 1} z 6.  

Dotychczasowe kroki przepisu:
${previousSteps || "Brak – to pierwszy krok."}

Twój krok musi być logicznie spójny z powyższymi i kontynuować przepis.
${agents[i].system}
`;

const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "SpeakLeash/bielik-7b-instruct-v0.1-gguf:Q6_K",
      messages: [
        { role: "system", content: agents[i].system },
        { role: "user", content: prompt },
      ],
      stream: false,
    }),
  });

        if (!response.ok) {
          throw new Error(`Błąd API: ${response.status}`);
        }

        const raw = await response.text();
        let data;

        try {
          // próba zwykłego parsowania
          data = JSON.parse(raw);
        } catch {
          // jeśli serwer zwrócił kilka JSON-ów w strumieniu,
          // bierzemy ostatnią niepustą linię i próbujemy ją zparsować
          const lines = raw
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
          const last = lines[lines.length - 1];
          data = last ? JSON.parse(last) : null;
        }

        const content =
          data?.message?.content || "Brak odpowiedzi od modelu.";

        // aktualizujemy kroki na bieżąco, po odpowiedzi każdego agenta
        setSteps((prev) => {
          const next = [...prev];
          next[i] = content;
          return next;
        });
      }
    } catch (e) {
      setError(
        e?.message ||
          "Wystąpił nieoczekiwany błąd podczas komunikacji z modelem."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "40px 16px",
        background:
          "radial-gradient(circle at top left, #f9fafb 0, #e5e7eb 30%, #d1d5db 70%, #9ca3af 100%)",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          padding: "32px 28px",
          boxShadow:
            "0 18px 45px rgba(15, 23, 42, 0.25), 0 4px 8px rgba(15, 23, 42, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(148, 163, 184, 0.4)",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: "rgba(15,23,42,0.05)",
              width: "fit-content",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#4b5563",
              fontWeight: 600,
            }}
          >
            Multi-agent · Przepisy
          </div>
          <h1
            style={{
              fontSize: "28px",
              margin: 0,
              color: "#111827",
            }}
          >
            System Multi‑Agent AI do przepisu na ciasto orzechowe
          </h1>
          <p
            style={{
              margin: 0,
              color: "#4b5563",
              maxWidth: "640px",
              fontSize: "14px",
            }}
          >
            Kilku agentów o różnych rolach generuje kolejne kroki tego samego
            przepisu. Zobacz, jak różne style opisu tworzą spójną instrukcję
            przygotowania ciasta.
          </p>
        </header>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              fontSize: "12px",
              color: "#4b5563",
            }}
          >
            {agents.map((agent) => (
              <span
                key={agent.name}
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                {agent.name}
              </span>
            ))}
          </div>

          <button
            onClick={runAgents}
            disabled={loading}
            style={{
              marginTop: "4px",
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 40%, #7c3aed 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: "14px",
              cursor: loading ? "default" : "pointer",
              boxShadow:
                "0 10px 25px rgba(37, 99, 235, 0.4), 0 2px 4px rgba(30, 64, 175, 0.3)",
              opacity: loading ? 0.7 : 1,
              transition:
                "transform 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out",
            }}
          >
            {loading ? "Generowanie kroków..." : "Uruchom agentów"}
          </button>

          {error && (
            <div
              style={{
                marginTop: "8px",
                padding: "8px 10px",
                borderRadius: "10px",
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                fontSize: "13px",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          {!loading && steps.length === 0 && !error && (
            <p
              style={{
                marginTop: "4px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Kliknij przycisk, aby wygenerować przepis. Każdy agent odpowiada
              za inny krok w swoim unikalnym stylu.
            </p>
          )}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {steps.map((step, i) => (
            <article
              key={i}
              style={{
                padding: "16px 14px",
                borderRadius: "16px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "8px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    color: "#111827",
                  }}
                >
                  Krok {i + 1}
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: "#eef2ff",
                    color: "#3730a3",
                    border: "1px solid #c7d2fe",
                    whiteSpace: "nowrap",
                  }}
                >
                  {agents[i]?.name || "Agent"}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#374151",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {step}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}