import React, { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          stream: false,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
      }

      const data = await response.json();
      const content = data.message?.content || "(brak odpowiedzi)";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas wysyłania wiadomości.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatPanel">
      <div className="chatMessages">
        {messages.length === 0 && (
          <div className="chatEmpty">Wyślij wiadomość, aby rozpocząć rozmowę.</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chatBubble chatBubble${msg.role === "user" ? "User" : "Assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chatBubble chatBubbleAssistant chatBubbleLoading">
            Piszę...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chatError">{error}</div>}

      <div className="chatInputRow">
        <textarea
          className="chatInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz wiadomość..."
          rows={2}
          disabled={loading}
        />
        <button
          type="button"
          className="chatSendButton"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}
