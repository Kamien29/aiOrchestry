import React, { useState } from "react";

const API_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2";

const AGENTS = [
  { id: "planner", name: "Planista", prompt: "Zaplanuj przepis na podstawie podanych składników." },
  { id: "executor", name: "Wykonawca", prompt: "Przygotuj szczegółowe kroki wykonania przepisu." },
];

export default function ExamplePanel() {
  const [ingredients, setIngredients] = useState("");
  const [agents] = useState(AGENTS);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAgents = async () => {
    if (!ingredients.trim()) {
      setError("Podaj składniki.");
      return;
    }
    setError(null);
    setLoading(true);
    setSteps([]);

    try {
      const allSteps = [];
      let context = `Składniki: ${ingredients}`;

      for (const agent of agents) {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: MODEL,
            stream: false,
            messages: [
              { role: "system", content: agent.prompt },
              { role: "user", content: context },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`Błąd API: ${response.status}`);
        }

        const data = await response.json();
        const content = data.message?.content || "";
        allSteps.push({ agent: agent.name, result: content });
        context = content;
      }

      setSteps(allSteps);
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas uruchamiania agentów.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="examplePanel">
      <h2>Przepis multi‑agentowy</h2>
      <div className="exampleForm">
        <label>
          Składniki:
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="np. mąka, jajka, mleko..."
            rows={3}
          />
        </label>
        <button type="button" onClick={runAgents} disabled={loading}>
          {loading ? "Uruchamiam agentów..." : "Uruchom agentów"}
        </button>
      </div>

      {error && <div className="exampleError">{error}</div>}

      {steps.length > 0 && (
        <div className="exampleSteps">
          <h3>Wyniki agentów</h3>
          {steps.map((s, i) => (
            <div key={i} className="exampleStep">
              <strong>{s.agent}:</strong>
              <pre>{s.result}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
