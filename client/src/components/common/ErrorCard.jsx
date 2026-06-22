function classify(message = "") {
  const m = message.toLowerCase();
  if (m.includes("429") || m.includes("quota") || m.includes("rate")) {
    return {
      title: "High demand right now",
      hint: "The free AI tier is rate-limited. Wait about a minute and try again — your input wasn't lost.",
      tone: "warn",
    };
  }
  if (m.includes("api key") || m.includes("not configured") || m.includes("401")) {
    return {
      title: "Service not configured",
      hint: "The server is missing a valid GEMINI_API_KEY (and optionally VIRUSTOTAL_API_KEY) in its .env file.",
      tone: "danger",
    };
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return {
      title: "Can't reach the server",
      hint: "Make sure the backend is running on port 3001, then try again.",
      tone: "danger",
    };
  }
  return {
    title: "Analysis failed",
    hint: "Something went wrong while analyzing. Please try again.",
    tone: "danger",
  };
}

export default function ErrorCard({ message, onRetry }) {
  const { title, hint, tone } = classify(message);

  return (
    <section className={`card error-card tone-${tone}`}>
      <div className="error-icon" aria-hidden="true">
        {tone === "warn" ? "⏳" : "⚠️"}
      </div>
      <h3 className="block-title">{title}</h3>
      <p className="error-hint">{hint}</p>
      <details className="error-details">
        <summary>Technical details</summary>
        <code className="error-raw">{message}</code>
      </details>
      <button type="button" className="action-btn primary" onClick={onRetry}>
        Try Again
      </button>
    </section>
  );
}
