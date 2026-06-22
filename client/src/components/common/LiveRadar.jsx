import { useState, useEffect } from "react";

const SCAM_TYPES = [
  "Phishing URL",
  "Fake Invoice",
  "IRS Scam Call",
  "Netflix Billing Fake",
  "Crypto Giveaway Scam",
  "Malicious PDF",
  "Compromised Account Link",
  "Fake Tech Support Pop-up",
];

const PLATFORMS = ["Email", "SMS", "WhatsApp", "X", "Facebook", "Web"];

function generateFakeThreat() {
  const type = SCAM_TYPES[Math.floor(Math.random() * SCAM_TYPES.length)];
  const plat = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
  const id = Math.random().toString(36).substring(2, 8);
  return { id, text: `🔴 BLOCKED: ${type} intercepted via ${plat}`, time: new Date() };
}

export default function LiveRadar() {
  const [threats, setThreats] = useState(() => {
    return Array.from({ length: 5 }, generateFakeThreat);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats((prev) => {
        const next = [generateFakeThreat(), ...prev];
        if (next.length > 5) next.pop();
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-radar" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "1rem",
      margin: "2rem 0",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
        color: "var(--accent)",
        fontWeight: "bold",
        fontSize: "0.9rem",
        textTransform: "uppercase",
        letterSpacing: "1px"
      }}>
        <span className="pulsing-dot" style={{
          width: "8px", height: "8px", background: "var(--danger)", borderRadius: "50%",
          boxShadow: "0 0 8px var(--danger)", animation: "pulse 1.5s infinite"
        }} />
        Live Threat Radar
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {threats.map((t, i) => (
          <div key={t.id} style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: i === 0 ? "var(--text)" : "var(--text-dim)",
            opacity: 1 - (i * 0.15),
            transform: `translateY(${i === 0 ? "0" : "0"})`,
            transition: "all 0.5s ease"
          }}>
            <span style={{ fontFamily: "monospace" }}>{t.text}</span>
            <span style={{ color: "var(--text-dim)" }}>
              {i === 0 ? "Just now" : `${i * 4}s ago`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
