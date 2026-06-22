const AUTHORITIES = [
  {
    flag: "🇮🇳",
    name: "India — Cyber Crime Portal",
    desc: "Report financial fraud & phishing (call 1930)",
    url: "https://cybercrime.gov.in/",
  },
  {
    flag: "🇺🇸",
    name: "USA — FTC ReportFraud",
    desc: "Federal Trade Commission fraud reporting",
    url: "https://reportfraud.ftc.gov/",
  },
  {
    flag: "🇬🇧",
    name: "UK — Action Fraud",
    desc: "National fraud & cybercrime reporting",
    url: "https://www.actionfraud.police.uk/",
  },
  {
    flag: "🌐",
    name: "Global — APWG",
    desc: "Forward phishing to reportphishing@apwg.org",
    url: "https://apwg.org/reportphishing/",
  },
];

/** Real-world next step: report the scam to official authorities. */
export default function TakeAction() {
  return (
    <div className="result-block take-action">
      <h3 className="block-title">🚨 Take action — report this scam</h3>
      <p className="dna-hint">
        Reporting helps authorities shut down scams and protect others. Pick your region:
      </p>
      <div className="authority-grid">
        {AUTHORITIES.map((a) => (
          <a
            key={a.name}
            className="authority-card"
            href={a.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="authority-flag">{a.flag}</span>
            <span className="authority-body">
              <span className="authority-name">{a.name}</span>
              <span className="authority-desc">{a.desc}</span>
            </span>
            <span className="authority-arrow">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
