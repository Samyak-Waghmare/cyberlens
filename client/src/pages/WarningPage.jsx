import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VerdictBanner from "../components/result/VerdictBanner.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

export default function WarningPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = searchParams.get("data");
    if (raw) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(raw)));
        setData(decoded);
      } catch (e) {
        console.error("Failed to decode warning data", e);
      }
    }
  }, [searchParams]);

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2>Invalid Warning Link</h2>
        <p>This warning link is broken or malformed.</p>
        <button className="action-btn primary" onClick={() => navigate("/analyzer")}>
          Go to Scam Analyzer
        </button>
      </div>
    );
  }

  const isScam = data.verdict !== "SAFE";

  return (
    <>
      <PageHeader
        icon="🛑"
        title={isScam ? "WARNING: THREAT DETECTED" : "SAFE LINK SCANNED"}
        description="Someone sent you a link to this threat report. Please review the details before interacting with the original message."
      />
      
      <section className="result card" style={{
        borderColor: isScam ? "var(--danger)" : "var(--accent)",
        boxShadow: isScam ? "0 0 40px rgba(239, 68, 68, 0.2)" : undefined
      }}>
        <VerdictBanner verdict={data.verdict} summary={data.summary} />

        <div className="result-block" style={{ marginTop: "2rem" }}>
          <h3 className="block-title">Original Message / Link</h3>
          <pre className="dojo-content" style={{
            background: "var(--bg-surface)",
            padding: "1rem",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all"
          }}>
            {data.input}
          </pre>
        </div>

        {isScam && (
          <div className="result-block" style={{ marginTop: "2rem", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--danger)" }}>
            <h3 className="block-title" style={{ color: "var(--danger)" }}>What should you do?</h3>
            <ul style={{ margin: "1rem 0 0 1.5rem", color: "var(--text)" }}>
              <li style={{ marginBottom: "0.5rem" }}><strong>DO NOT</strong> click any links or download any files from the original message.</li>
              <li style={{ marginBottom: "0.5rem" }}><strong>DO NOT</strong> reply to the sender, even if you think you know them (their account may be compromised).</li>
              <li><strong>DELETE</strong> the original message immediately.</li>
            </ul>
          </div>
        )}

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-dim)", marginBottom: "1rem" }}>
            Want to scan your own suspicious links or messages?
          </p>
          <button className="action-btn primary" onClick={() => navigate("/analyzer")}>
            Use CyberLens Scam Analyzer
          </button>
        </div>
      </section>
    </>
  );
}
