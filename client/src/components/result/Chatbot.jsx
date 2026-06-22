import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../../services/api.js";

export default function Chatbot({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await askQuestion(context, userMsg);
      setMessages((prev) => [...prev, { role: "ai", content: res.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Failed to connect to AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container" style={{
      marginTop: "2rem",
      border: "1px solid var(--border)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "var(--bg-card)"
    }}>
      <div className="chatbot-header" style={{
        padding: "0.75rem 1rem",
        backgroundColor: "var(--bg-card-hover)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span style={{ fontSize: "1.2rem" }}>🤖</span>
        <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text)" }}>Ask AI about this threat</h3>
      </div>
      
      <div className="chatbot-messages" style={{
        padding: "1rem",
        maxHeight: "300px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-dim)", fontStyle: "italic", fontSize: "0.9rem" }}>
            Not sure what something means? Ask CyberLens.
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.role === "user" ? "var(--accent)" : msg.role === "error" ? "var(--danger)" : "var(--bg-surface)",
            color: msg.role === "user" ? "var(--bg)" : "var(--text)",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            maxWidth: "85%",
            fontSize: "0.95rem",
            lineHeight: "1.4"
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: "var(--accent)", fontSize: "0.9rem", padding: "0.5rem" }}>
            [SYS] AI THINKING...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} style={{
        display: "flex",
        borderTop: "1px solid var(--border)",
        padding: "0.5rem"
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={loading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "var(--text)",
            padding: "0.5rem",
            outline: "none",
            fontSize: "0.95rem"
          }}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{
          background: "transparent",
          color: "var(--accent)",
          border: "none",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          fontWeight: "bold",
          opacity: (loading || !input.trim()) ? 0.5 : 1
        }}>
          SEND
        </button>
      </form>
    </div>
  );
}
