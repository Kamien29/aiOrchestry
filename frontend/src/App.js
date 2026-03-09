import React, { useState } from "react";
import "./App.css";
import Example from "./components/Example/Example";
import Chat from "./components/chat/chat";

export default function App() {
  const [activeMode, setActiveMode] = useState("example");

  return (
    <div className="page">
      <div className="shell">
        <nav className="mainNav">
          <button
            type="button"
            className={activeMode === "example" ? "navTab navTabActive" : "navTab"}
            onClick={() => setActiveMode("example")}
          >
            Multi-agent · Przepisy
          </button>
          <button
            type="button"
            className={activeMode === "chat" ? "navTab navTabActive" : "navTab"}
            onClick={() => setActiveMode("chat")}
          >
            Chat z modelem
          </button>
        </nav>

        <main className="mainContent">
          {activeMode === "example" ? <Example /> : <Chat />}
        </main>
      </div>
    </div>
  );
}
