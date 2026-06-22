import { useEffect, useRef, useState } from "react";
import VerdictBanner from "./VerdictBanner.jsx";
import RiskMeter from "./RiskMeter.jsx";
import RedFlags from "./RedFlags.jsx";
import ThreatSignals from "./ThreatSignals.jsx";
import VirusTotalPanel from "./VirusTotalPanel.jsx";
import ScamDNA from "./ScamDNA.jsx";
import TakeAction from "./TakeAction.jsx";
import Chatbot from "./Chatbot.jsx";
import { RISK_BANDS } from "../../constants/verdicts.js";
import { buildReportText } from "../../utils/report.js";

// Lazily loaded — keeps jsPDF out of the initial bundle.
const loadExporters = () => import("../../utils/exportReport.js");

export default function ResultCard({ result, onReset, onToast, onRetryAI }) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(buildReportText(result));
      setCopied(true);
      onToast?.("Report copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      onToast?.("Couldn't access clipboard", "error");
    }
  };

  const runExport = async (fnName, message, tone = "success") => {
    setMenuOpen(false);
    try {
      const mod = await loadExporters();
      const ok = mod[fnName](result);
      if (ok === false) {
        onToast?.("Pop-up blocked — allow pop-ups to print", "error");
      } else {
        onToast?.(message, tone);
      }
    } catch {
      onToast?.("Export failed — please try again", "error");
    }
  };

  const EXPORTS = [
    { icon: "📄", label: "Download PDF", run: () => runExport("exportResultToPdf", "PDF report downloaded") },
    { icon: "📝", label: "Download Word", run: () => runExport("exportResultToWord", "Word report downloaded") },
    { icon: "🖨️", label: "Print report", run: () => runExport("printResult", "Opening print dialog…", "info") },
    { icon: "✉️", label: "Email report", run: () => runExport("emailResult", "Opening your mail app…", "info") },
  ];

  const paragraphs = (result.explanation || "").split(/\n{2,}/).filter(Boolean);
  const degraded = result.degraded;
  const heur = result.heuristics;
  const input = result.meta?.input;
  const engineLabel = degraded ? "Offline Engine" : "Gemini AI + Offline Engine";

  return (
    <section className="result card">
      <div className="result-engine">
        <span className={`engine-badge ${degraded ? "offline" : "ai"}`}>
          {degraded ? "⚡" : "✨"} Analyzed by {engineLabel}
        </span>
        {result.meta?.reportId && (
          <span className="engine-id mono">{result.meta.reportId}</span>
        )}
      </div>

      {degraded && (
        <div className="degraded-notice">
          <span className="degraded-icon">⚡</span>
          <div className="degraded-body">
            <strong>AI service was unavailable — showing offline analysis.</strong>
            <span>
              This result comes from our on-device heuristic engine, so you're still
              protected. Retry for the full AI deep-scan.
            </span>
          </div>
          {onRetryAI && input && (
            <button
              type="button"
              className="degraded-retry"
              onClick={() => onRetryAI(input)}
            >
              Retry AI scan
            </button>
          )}
        </div>
      )}

      <VerdictBanner verdict={result.verdict} summary={result.summary} />

      <div className="result-meter-row">
        <RiskMeter score={result.score} />
        <div className="meter-legend">
          {RISK_BANDS.map((b) => (
            <span key={b.label}>
              <i className={`dot ${b.dot}`} /> {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="result-block">
        <h3 className="block-title">{degraded ? "What we found" : "What the AI found"}</h3>
        {paragraphs.map((p, i) => (
          <p className="explanation" key={i}>
            {p}
          </p>
        ))}
        <RedFlags flags={result.red_flags} />
      </div>

      {heur && input && <ScamDNA text={input} highlights={heur.highlights} />}

      {result.signals?.length > 0 && (
        <div className="result-block">
          <h3 className="block-title">Threat signals</h3>
          <ThreatSignals signals={result.signals} />
        </div>
      )}

      <div className="result-block">
        <h3 className="block-title">Security Vendors</h3>
        <VirusTotalPanel virustotal={result.virustotal} />
        {result.additional_apis && (
          <div className="additional-apis-grid" style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
            {Object.values(result.additional_apis).filter(Boolean).map(api => (
              <div key={api.name} className="api-panel" style={{ background: "var(--bg-card)", padding: "1rem", borderLeft: api.configured ? "2px solid var(--accent)" : "2px solid var(--border)" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text)" }}>{api.name}</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-dim)" }}>
                  {api.configured ? "✅ " : "⚡ "}
                  {api.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {result.recommendation?.length > 0 && (
        <div className="result-block recommendation">
          <h3 className="block-title">What should you do?</h3>
          <ul className="recommend-list">
            {result.recommendation.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {result.verdict !== "SAFE" && <TakeAction />}

      {!degraded && <Chatbot context={result} />}

      <div className="result-actions">
        <div className="export-wrap" ref={menuRef}>
          <button
            type="button"
            className="action-btn primary"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            ⬇ Export Report <span className="caret">▾</span>
          </button>
          {menuOpen && (
            <div className="export-menu" role="menu">
              {EXPORTS.map((e) => (
                <button
                  key={e.label}
                  type="button"
                  className="export-item"
                  role="menuitem"
                  onClick={e.run}
                >
                  <span className="export-ico">{e.icon}</span>
                  {e.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="action-btn" onClick={copyReport}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <button type="button" className="action-btn" onClick={onReset}>
          Scan Another
        </button>
        <button type="button" className="action-btn danger" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "1px solid var(--danger)" }} onClick={() => {
          const summaryData = {
            verdict: result.verdict,
            score: result.score,
            summary: result.summary,
            input: result.meta?.input?.substring(0, 500) // Truncate to fit in URL
          };
          const encoded = btoa(encodeURIComponent(JSON.stringify(summaryData)));
          const url = `${window.location.origin}/warning?data=${encoded}`;
          navigator.clipboard.writeText(url).then(() => {
            onToast?.("Warning Link Copied! Share it with your friends.", "success");
          });
        }}>
          🔗 Share Warning Link
        </button>
      </div>
    </section>
  );
}
