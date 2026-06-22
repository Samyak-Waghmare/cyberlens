const STATS = [
  { value: "$10.2B", label: "Lost to cybercrime globally in 2023" },
  { value: "3.4B", label: "Phishing emails sent daily" },
  { value: "11s", label: "Frequency of ransomware attacks" },
];

export default function ThreatStats() {
  return (
    <section className="threat-stats-section">
      <div className="threat-stats-container">
        <div className="threat-text">
          <span className="section-eyebrow" style={{ color: "var(--danger)" }}>The Landscape</span>
          <h2 className="section-title">The internet is a hostile environment.</h2>
          <p className="section-sub" style={{ margin: 0 }}>
            Cybercrime is scaling through automation and generative AI. 
            Legacy antiviruses aren't enough to protect against modern social engineering. 
            You need a toolkit built for the current threat landscape.
          </p>
        </div>
        
        <div className="threat-metrics">
          {STATS.map((s, i) => (
            <div className="threat-metric" key={i}>
              <span className="tm-value">{s.value}</span>
              <span className="tm-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
