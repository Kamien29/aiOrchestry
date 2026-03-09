import React, { useState } from "react";

const API_URL = "http://ollama:11434/api/chat";
const MODEL = "SpeakLeash/bielik-7b-instruct-v0.1-gguf:Q6_K";

const AGENTS = [
  { name: "Militarny", system: "Jesteś wojskowym instruktorem. Pisz rozkazującym stylem." },
  { name: "Cywilny", system: "Jesteś domowym kucharzem. Pisz spokojnie." },
  { name: "Morski", system: "Jesteś kucharzem na statku." },
  { name: "Lądowy", system: "Jesteś kucharzem polowym." },
  { name: "Wywiad", system: "Jesteś analitykiem wywiadu opisującym operację." },
  { name: "Neutralny", system: "Jesteś neutralnym asystentem kuchennym." },
];

export default function Example() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  function cleanResponse(text) {
    if (!text) return "";
  
    let cleaned = text
      .replace(/krok\s*\d+\s*:/gi, "")   // usuwa "Krok 3:"
      .replace(/^\d+\./gm, "")           // usuwa "3."
      .replace(/^\d+\)/gm, "")           // usuwa "3)"
      .replace(/Twój krok:?/gi, "")      // usuwa "Twój krok"
      .trim();
  
    // zostawia tylko pierwsze zdanie
    cleaned = cleaned.split(/[\n\.]/)[0];
  
    return cleaned.trim();
  }
  async function runAgents() {
    setError(null);
    setLoading(true);
    setSteps([]);

    try {
      const accumulatedSteps = [];

      for (let i = 0; i < AGENTS.length; i++) {
        const previousSteps = accumulatedSteps
          .map((s, idx) => `${idx + 1}. ${s}`)
          .join("\n");

        const prompt = `
To jest krok ${i + 1} z 6 przepisu na ciasto orzechowe.

Dotychczasowe kroki:
${previousSteps || "Brak – to pierwszy krok."}

Twoje zadanie:

- Napisz tylko jeden nowy krok.
- Nie powtarzaj wcześniejszych kroków.
- Nie numeruj listy.
- Nie pisz "Twój krok".
- Napisz jedno zdanie instrukcji kulinarnej.
- Pisz w języku polskim.
-twoja rola: ${AGENTS[i].name} a style opisu: ${AGENTS[i].system}, twój styl misania ma sugerować twoją rolę.
`;

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: AGENTS[i].system },
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
          data = JSON.parse(raw);
        } catch {
          const lines = raw
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

          const last = lines[lines.length - 1];
          data = last ? JSON.parse(last) : null;
        }

        let content = data?.message?.content || "Brak odpowiedzi";

        content = cleanResponse(content);

        accumulatedSteps[i] = content;

        setSteps([...accumulatedSteps]);
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
    <div className="example">
      <header className="exampleHeader">
        <div className="exampleBadge">Multi-agent · Przepisy</div>

        <h1 className="exampleTitle">
          System Multi-Agent AI do przepisu na ciasto orzechowe
        </h1>

        <p className="exampleDesc">
          Kilku agentów o różnych rolach generuje kolejne kroki tego samego
          przepisu. Zobacz, jak różne style opisu tworzą spójną instrukcję
          przygotowania ciasta.
        </p>
      </header>

      <section className="exampleControls">
        <div className="exampleAgentTags">
          {AGENTS.map((agent) => (
            <span key={agent.name} className="exampleAgentTag">
              {agent.name}
            </span>
          ))}
        </div>

        <button
          onClick={runAgents}
          disabled={loading}
          className="exampleRunButton"
        >
          {loading ? "Generowanie kroków..." : "Uruchom agentów"}
        </button>

        {error && <div className="exampleError">{error}</div>}

        {!loading && steps.length === 0 && !error && (
          <p className="exampleHint">
            Kliknij przycisk, aby wygenerować przepis. Każdy agent odpowiada
            za inny krok w swoim unikalnym stylu.
          </p>
        )}
      </section>

      <section className="exampleSteps">
        {steps.map((step, i) => (
          <article key={i} className="exampleStepCard">
            <div className="exampleStepHeader">
              <h3>Krok {i + 1}</h3>

              <span className="exampleStepAgent">
                {AGENTS[i]?.name}
              </span>
            </div>

            <p className="exampleStepText">{step}</p>
          </article>
        ))}
      </section>
    </div>
  );
}