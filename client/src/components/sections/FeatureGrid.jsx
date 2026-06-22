import { Link } from "react-router-dom";

const TOOLS = [
  {
    id: "analyzer",
    href: "/analyzer",
    icon: "🛡️",
    label: "Scam Analyzer",
    desc: "Paste any URL, email, or message for an instant AI + VirusTotal threat report.",
    color: "#7c6dff",
    badge: "Most popular",
  },
  {
    id: "password",
    href: "/password",
    icon: "🔑",
    label: "Password Lab",
    desc: "Check strength, crack time, entropy, and known data breach exposure.",
    color: "#10b981",
  },
  {
    id: "privacy",
    href: "/privacy",
    icon: "🕵️",
    label: "Privacy Checkup",
    desc: "See your digital fingerprint — IP, browser signals, trackability score.",
    color: "#a78bfa",
  },
  {
    id: "website",
    href: "/website",
    icon: "🌐",
    label: "Website Inspector",
    desc: "Grade any domain's HTTP security headers and TLS configuration.",
    color: "#f59e0b",
  },
  {
    id: "dojo",
    href: "/dojo",
    icon: "🎯",
    label: "Phishing Dojo",
    desc: "Train yourself to spot real phishing attempts before they catch you.",
    color: "#f43f5e",
  },
  {
    id: "extension",
    href: "/extension",
    icon: "🧩",
    label: "Chrome Extension",
    desc: "Scan any link on the internet instantly without leaving your current tab.",
    color: "#0ea5e9",
  },
  {
    id: "logs",
    href: "/logs",
    icon: "📊",
    label: "Threat Dashboard",
    desc: "Upload raw server logs for AI-driven threat hunting and remediation steps.",
    color: "#eab308",
  },
];

export default function FeatureGrid() {
  return (
    <section className="feature-grid-section" id="tools">
      <div className="section-head">
        <span className="section-eyebrow">The Suite</span>
        <h2 className="section-title">Five tools. One mission.</h2>
        <p className="section-sub">Everything you need to stay safe in the modern threat landscape.</p>
      </div>

      <div className="feature-grid">
        {TOOLS.map((t) => (
          <Link to={t.href} key={t.id} className="feature-card" style={{ "--card-color": t.color }}>
            <div className="feature-card-top">
              <span className="feature-icon" aria-hidden="true">{t.icon}</span>
              {t.badge && <span className="feature-badge">{t.badge}</span>}
            </div>
            <h3 className="feature-title">{t.label}</h3>
            <p className="feature-desc">{t.desc}</p>
            <span className="feature-cta">
              Open tool
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
