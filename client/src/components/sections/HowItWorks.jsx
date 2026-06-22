const STEPS = [
  {
    num: "01",
    icon: "🖼️",
    title: "Paste text or scan a screenshot",
    text: "Drop in a URL, email, or message — or upload a screenshot of a scam SMS or WhatsApp. On-device OCR reads it instantly, no data sent.",
  },
  {
    num: "02",
    icon: "🔎",
    title: "Triple-layer AI analysis",
    text: "An offline heuristic engine, VirusTotal's 70+ engines, and Gemini AI inspect it together — still works even when AI is offline.",
  },
  {
    num: "03",
    icon: "🛡️",
    title: "Understand, export & act",
    text: "A clear verdict with Scam DNA highlights, an exportable PDF report, and one-click reporting links to cybercrime authorities.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="section-head">
        <span className="section-eyebrow">How it works</span>
        <h2 className="section-title">Three steps to safety</h2>
        <p className="section-sub">
          Turn a scary, confusing message into a clear, trusted answer.
        </p>
      </div>

      <div className="how-grid">
        {STEPS.map((s) => (
          <article className="how-card" key={s.num}>
            <div className="how-card-top">
              <span className="how-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="how-num">{s.num}</span>
            </div>
            <h3 className="how-card-title">{s.title}</h3>
            <p className="how-card-text">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
