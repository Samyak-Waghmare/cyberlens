import { useRef, useState } from "react";
import ScrambleText from "../common/ScrambleText.jsx";

const DUMMY_LOGS = `192.168.1.100 - - [10/Oct/2026:13:55:36 -0700] "GET /login HTTP/1.1" 200 2326
192.168.1.100 - - [10/Oct/2026:13:55:40 -0700] "POST /login HTTP/1.1" 401 128
192.168.1.100 - - [10/Oct/2026:13:55:41 -0700] "POST /login HTTP/1.1" 401 128
45.22.11.9 - - [10/Oct/2026:13:56:02 -0700] "GET /admin/config.php?id=1' OR '1'='1 HTTP/1.1" 500 432
45.22.11.9 - - [10/Oct/2026:13:56:05 -0700] "GET /etc/passwd HTTP/1.1" 404 156
45.22.11.9 - - [10/Oct/2026:13:56:08 -0700] "POST /api/upload HTTP/1.1" 200 89
10.0.0.5 - - [10/Oct/2026:13:57:12 -0700] "GET / HTTP/1.1" 200 4322`;

export default function LogAnalyzer({ status, result, error, onAnalyze, onReset, onToast }) {
  const [value, setValue] = useState("");
  const fileRef = useRef(null);

  const busy = status === "loading";

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setValue(text.slice(0, 50000)); // Cap at 50KB roughly
      onToast?.("Log file loaded", "success");
    };
    reader.onerror = () => onToast?.("Failed to read file", "error");
    reader.readAsText(file);
  };

  if (status === "loading") {
    return (
      <section className="tool card loading-card">
        <div className="radar-bg" />
        <div className="loading-content" style={{ marginBottom: "2rem" }}>
          <div className="spinner" />
          <h2 className="loading-title">
            <ScrambleText text="[SOC] ANALYZING LOG VECTORS..." />
          </h2>
          <p className="loading-sub">Hunting for anomalies, injections, and unauthorized access.</p>
        </div>
        <div className="skeleton-container" style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", opacity: 0.6, marginTop: "2rem" }}>
           <div style={{ height: "80px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite" }}></div>
           <div style={{ height: "40px", width: "70%", borderRadius: "8px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite 0.2s" }}></div>
           <div style={{ height: "120px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite 0.4s" }}></div>
        </div>
      </section>
    );
  }

  if (status === "done" && result) {
    return (
      <section className="tool card result">
        <div className="result-engine">
          <span className="engine-badge ai">✨ Analyzed by Gemini AI</span>
        </div>
        
        <div className="verdict-banner" style={{ borderLeft: `4px solid ${getSeverityColor(result.severity)}` }}>
          <h2 className="verdict-title">{result.severity} Severity</h2>
          <p className="verdict-summary">{result.summary}</p>
        </div>

        {result.threats && result.threats.length > 0 && (
          <div className="result-block">
            <h3 className="block-title">Identified Threats</h3>
            <div className="threats-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {result.threats.map((t, i) => (
                <div key={i} className="api-panel" style={{ background: "var(--bg-card)", padding: "1rem", borderLeft: "2px solid var(--danger)" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--danger)" }}>{t.name}</h4>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>{t.description}</p>
                  {t.indicators && t.indicators.length > 0 && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: "4px" }}>
                      <strong>Indicators:</strong> {t.indicators.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {result.remediation && result.remediation.length > 0 && (
          <div className="result-block recommendation">
            <h3 className="block-title">Remediation Steps</h3>
            <ul className="recommend-list">
              {result.remediation.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="result-actions" style={{ marginTop: "2rem" }}>
          <button type="button" className="action-btn" onClick={onReset}>Analyze New Logs</button>
        </div>
      </section>
    );
  }

  if (status === "done" && error) {
    return (
      <section className="tool card result">
        <div className="verdict-banner" style={{ borderLeft: "4px solid var(--danger)" }}>
          <h2 className="verdict-title">Analysis Failed</h2>
          <p className="verdict-summary">{error}</p>
        </div>
        <div className="result-actions" style={{ marginTop: "2rem" }}>
          <button type="button" className="action-btn" onClick={onReset}>Try Again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="analyzer card">
      <div className="textarea-wrap" style={{ marginTop: "1.5rem" }}>
        <textarea
          className="analyzer-textarea"
          placeholder="Paste log data here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={busy}
          spellCheck="false"
          style={{ height: "200px" }}
        />
        <div className="textarea-tools">
          <button type="button" className="tool-btn" onClick={() => fileRef.current?.click()} disabled={busy}>[UPLOAD .LOG FILE]</button>
          {value && <button type="button" className="tool-btn" onClick={() => setValue("")} disabled={busy}>[CLEAR]</button>}
        </div>
        <input ref={fileRef} type="file" accept=".log,.txt" hidden onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ""; }} />
      </div>

      <div className="analyzer-meta">
        <div className="example-buttons" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.1)", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <span className="try-label" style={{ color: "var(--accent)", fontWeight: "bold" }}>💡 Don't have one?</span>
          <button type="button" className="example-btn" onClick={() => setValue(DUMMY_LOGS)} style={{ background: "transparent", border: "none", color: "var(--text)", textDecoration: "underline", cursor: "pointer", fontSize: "0.9rem" }}>
            Try a demo log
          </button>
        </div>
      </div>

      <button type="button" className="analyze-btn" onClick={() => value.trim() && onAnalyze(value)} disabled={busy || !value.trim()}>
        RUN THREAT HUNT
      </button>
    </section>
  );
}

function getSeverityColor(sev) {
  switch ((sev || "").toLowerCase()) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#eab308";
    case "low": return "#3b82f6";
    case "safe": return "#10b981";
    default: return "#9ca3af";
  }
}
