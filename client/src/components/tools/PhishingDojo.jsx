import { useState } from "react";
import { DOJO_ROUNDS } from "../../constants/dojo.js";

export default function PhishingDojo() {
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState(null); // "scam" | "legit"
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = DOJO_ROUNDS.length;
  const item = DOJO_ROUNDS[round];

  const answer = (choice) => {
    if (answered) return;
    const correct = (choice === "scam") === item.isScam;
    if (correct) setScore((s) => s + 1);
    setAnswered(choice);
  };

  const next = () => {
    if (round + 1 >= total) {
      setFinished(true);
    } else {
      setRound((r) => r + 1);
      setAnswered(null);
    }
  };

  const restart = () => {
    setRound(0);
    setAnswered(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const rank = pct >= 80 ? "🛡️ Scam Slayer" : pct >= 50 ? "👀 Getting sharp" : "📚 Keep training";
    return (
      <section className="tool card" id="scanner">
        <div className="dojo-done">
          <div className="dojo-score">{score}/{total}</div>
          <h2 className="tool-title">{rank}</h2>
          <p className="tool-sub">
            You spotted {pct}% correctly. The more you practice, the harder you are to fool.
          </p>
          <button type="button" className="action-btn primary" onClick={restart}>
            Train again
          </button>
        </div>
      </section>
    );
  }

  const correct = answered && (answered === "scam") === item.isScam;

  return (
    <section className="tool card" id="scanner">
      <div className="dojo-bar">
        <span>Round {round + 1} / {total}</span>
        <span className="dojo-points">Score: {score}</span>
      </div>
      <div className="dojo-track">
        <div className="dojo-fill" style={{ width: `${(round / total) * 100}%` }} />
      </div>

      <div className="dojo-card">
        <span className="dojo-kind">{item.kind}</span>
        <pre className="dojo-content">{item.content}</pre>
      </div>

      {!answered ? (
        <div className="dojo-actions">
          <button type="button" className="dojo-btn legit" onClick={() => answer("legit")}>
            ✅ Looks legit
          </button>
          <button type="button" className="dojo-btn scam" onClick={() => answer("scam")}>
            🚨 It's a scam
          </button>
        </div>
      ) : (
        <div className="fade-in">
          <div className={`dojo-verdict ${correct ? "right" : "wrong"}`}>
            {correct ? "✓ Correct!" : "✗ Not quite."} This was{" "}
            <strong>{item.isScam ? "a SCAM" : "LEGIT"}</strong>.
          </div>
          <p className="dojo-why">{item.why}</p>
          <button type="button" className="action-btn primary" onClick={next}>
            {round + 1 >= total ? "See results" : "Next round →"}
          </button>
        </div>
      )}
    </section>
  );
}
