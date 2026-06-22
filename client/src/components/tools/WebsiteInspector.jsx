import { useState } from "react";
import { inspectUrl } from "../../services/api.js";
import ThreatSignals from "../result/ThreatSignals.jsx";

const GRADE_COLOR = {
  A: "#10b981", B: "#22c55e", C: "#f59e0b", D: "#f97316", F: "#ef4444",
};

export default function WebsiteInspector({ onToast }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const scan = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await inspectUrl(trimmed);
      setResult(data);
    } catch (err) {
      onToast?.(err.message || "Scan failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool card" id="scanner">
      <div className="tool-head">
        <h2 className="tool-title">🌐 Website Inspector</h2>
        <p className="tool-sub">
          Scan any website's HTTP security headers and TLS setup, then get a graded report —
          the same checks a security auditor runs first.
        </p>
      </div>

      <div className="pw-field">
        <input
          className="pw-input"
          type="text"
          placeholder="example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && scan()}
          spellCheck="false"
        />
        <button type="button" className="action-btn primary inspect-go" onClick={scan} disabled={loading}>
          {loading ? "Scanning…" : "Scan site"}
        </button>
      </div>

      {loading && (
        <div className="loading" style={{ paddingTop: "1.5rem" }}>
          <div className="loading-spinner" />
          <p className="loading-label">Fetching headers & evaluating security…</p>
        </div>
      )}

      {result && (
        <div className="fade-in">
          <div className="grade-row">
            <div
              className="grade-badge"
              style={{ borderColor: GRADE_COLOR[result.grade], color: GRADE_COLOR[result.grade] }}
            >
              {result.grade}
            </div>
            <div className="grade-body">
              <strong>Security grade · {result.score}/100</strong>
              <span className="mono">{result.url}</span>
              <span className="grade-summary">{result.summary} · HTTP {result.statusCode}</span>
            </div>
          </div>

          <div className="result-block">
            <h3 className="block-title">Security checks</h3>
            <ThreatSignals signals={result.checks} />
          </div>
        </div>
      )}

      {!result && !loading && (
        <p className="privacy-note">
          Try <code>github.com</code>, <code>google.com</code>, or any site you're unsure about.
          We only read response headers — nothing intrusive.
        </p>
      )}
    </section>
  );
}
