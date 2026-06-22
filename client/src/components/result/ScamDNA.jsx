const TYPE_LABEL = {
  "url-danger": "Dangerous link",
  "url-warn": "Suspicious link",
  "kw-danger": "High-risk phrase",
  "kw-warn": "Pressure / lure phrase",
};

/** Renders the original text with suspicious spans highlighted ("Scam DNA"). */
export default function ScamDNA({ text, highlights = [] }) {
  if (!text || highlights.length === 0) return null;

  // Build alternating plain / highlighted segments.
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const segments = [];
  let cursor = 0;

  sorted.forEach((h, i) => {
    if (h.start > cursor) {
      segments.push({ text: text.slice(cursor, h.start) });
    }
    segments.push({
      text: text.slice(h.start, h.end),
      type: h.type,
      title: `${TYPE_LABEL[h.type] || "Flagged"}: ${h.label}`,
    });
    cursor = h.end;
    if (i === sorted.length - 1 && cursor < text.length) {
      segments.push({ text: text.slice(cursor) });
    }
  });
  if (sorted.length === 0 && cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return (
    <div className="result-block">
      <h3 className="block-title">🧬 Scam DNA — what made this suspicious</h3>
      <p className="dna-hint">
        We highlighted the exact words and links that triggered the analysis. Learning
        these patterns helps you spot scams on your own.
      </p>
      <div className="dna-text">
        {segments.map((s, i) =>
          s.type ? (
            <mark key={i} className={`dna-mark ${s.type}`} title={s.title}>
              {s.text}
            </mark>
          ) : (
            <span key={i}>{s.text}</span>
          )
        )}
      </div>
      <div className="dna-legend">
        <span><i className="dna-dot kw-danger" /> High-risk phrase</span>
        <span><i className="dna-dot kw-warn" /> Pressure / lure</span>
        <span><i className="dna-dot url-danger" /> Dangerous link</span>
      </div>
    </div>
  );
}
