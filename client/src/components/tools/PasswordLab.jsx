import { useMemo, useState } from "react";
import { analyzePassword, generatePassword } from "../../utils/password.js";
import ScrambleText from "../common/ScrambleText.jsx";
import { checkPwnedPassword } from "../../services/hibp.js";

const STRENGTH_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#10b981"];

export default function PasswordLab({ onToast }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [breach, setBreach] = useState(null); // { count } | null
  const [checking, setChecking] = useState(false);
  const [genLen, setGenLen] = useState(16);
  const [genOpts, setGenOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });

  const analysis = useMemo(() => analyzePassword(pw), [pw]);

  const runBreachCheck = async () => {
    if (!pw) return;
    setChecking(true);
    setBreach(null);
    try {
      const { count } = await checkPwnedPassword(pw);
      setBreach({ count });
    } catch {
      onToast?.("Breach service unavailable — try again", "error");
    } finally {
      setChecking(false);
    }
  };

  const generate = () => {
    const next = generatePassword(genLen, genOpts);
    setPw(next);
    setShow(true);
    setBreach(null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pw);
      onToast?.("Password copied", "success");
    } catch {
      onToast?.("Couldn't copy", "error");
    }
  };

  const toggleOpt = (k) =>
    setGenOpts((o) => ({ ...o, [k]: !o[k] }));

  return (
    <section className="tool card" id="scanner">
      <div className="tool-head">
        <h2 className="tool-title">🔑 Password Lab</h2>
        <p className="tool-sub">
          Test a password's strength and check if it has leaked in a data breach — all
          processed privately in your browser.
        </p>
      </div>

      <div className="pw-field">
        <input
          className="pw-input"
          type={show ? "text" : "password"}
          placeholder="Type or generate a password…"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setBreach(null);
          }}
          autoComplete="off"
          spellCheck="false"
        />
        <button type="button" className="tool-btn" onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"}
        </button>
        {pw && (
          <button type="button" className="tool-btn" onClick={copy}>
            Copy
          </button>
        )}
      </div>

      {/* Strength meter */}
      <div className="strength">
        <div className="strength-bars">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="strength-seg"
              style={{
                background: i <= analysis.score && pw ? STRENGTH_COLORS[analysis.score] : "var(--border)",
              }}
            />
          ))}
        </div>
        <div className="strength-meta">
          <span style={{ color: pw ? STRENGTH_COLORS[analysis.score] : "var(--text-muted)" }}>
            {pw ? analysis.label : "Enter a password"}
          </span>
          {pw && (
            <span className="strength-stats mono">
              {analysis.entropyBits} bits · cracks in ~{analysis.crackTime}
            </span>
          )}
        </div>
      </div>

      {pw && analysis.suggestions.length > 0 && (
        <ul className="pw-tips">
          {analysis.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}

      {/* Breach check */}
      <div className="breach-row">
        <button
          type="button"
          className="action-btn primary"
          onClick={runBreachCheck}
          disabled={!pw || checking}
        >
          {checking ? <ScrambleText text="[API] HASHING AND QUERYING DATABASE..." /> : "CHECK EXPOSURE"}
        </button>
        {breach && (
          <div className={`breach-result ${breach.count > 0 ? "bad" : "good"}`}>
            {breach.count > 0 ? (
              <>
                <span style={{ color: "var(--danger)", marginRight: "0.5rem" }}>[CRITICAL ALERT]</span> 
                Signature exposed in {breach.count.toLocaleString()} known data breaches. Terminate usage immediately!
              </>
            ) : (
              <>
                <span style={{ color: "var(--safe)", marginRight: "0.5rem" }}>[NODE SECURE]</span> 
                Signature not found in any compromised datasets. Maintain cryptographic uniqueness.
              </>
            )}
          </div>
        )}
      </div>
      <p className="privacy-note">
        🔒 Privacy by design: only the first 5 characters of your password's SHA-1 hash are
        sent (k-anonymity). The password itself never leaves your device.
      </p>

      {/* Generator */}
      <div className="generator">
        <h3 className="block-title">Generate a strong password</h3>
        <div className="gen-controls">
          <label className="gen-len">
            Length: <strong>{genLen}</strong>
            <input
              type="range"
              min="8"
              max="40"
              value={genLen}
              onChange={(e) => setGenLen(Number(e.target.value))}
            />
          </label>
          <div className="gen-opts">
            {[
              ["upper", "A-Z"],
              ["lower", "a-z"],
              ["digits", "0-9"],
              ["symbols", "!@#"],
            ].map(([k, lbl]) => (
              <label key={k} className={`gen-opt ${genOpts[k] ? "on" : ""}`}>
                <input type="checkbox" checked={genOpts[k]} onChange={() => toggleOpt(k)} />
                {lbl}
              </label>
            ))}
          </div>
          <button type="button" className="action-btn" onClick={generate}>
            ⟳ Generate
          </button>
        </div>
      </div>
    </section>
  );
}
