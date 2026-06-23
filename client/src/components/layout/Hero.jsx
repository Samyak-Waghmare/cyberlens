import { Link } from "react-router-dom";



const TRUST = ["No login required", "Free forever", "Gemini + VirusTotal"];

export default function Hero() {
  return (
    <header className="hero" id="top">
      <span className="hero-pill">
        <span className="pill-dot" />
        Your complete AI-powered cyber-safety toolkit
      </span>

      <h1 className="hero-title glitch-hover">
        Detect scams.
        <br />
        <span className="grad-text">Stay safe online.</span>
      </h1>

      <p className="hero-subtitle">
        The ultimate cybersecurity suite — AI scam analysis, Web3 honeypot detection,
        global threat radar, password breach checks, and deep privacy audits.{" "}
        <em>Free, private, no login.</em>
      </p>

      <div className="hero-actions">
        <Link to="/analyzer" className="hero-cta">
          Start Scanning Free
          <span className="hero-cta-arrow">→</span>
        </Link>
        <a href="#tools" className="hero-cta-outline">
          Explore tools ↓
        </a>
      </div>

      <div className="trust-row">
        {TRUST.map((t) => (
          <span className="trust-badge" key={t}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                d="m5 13 4 4L19 7"
                fill="none"
                stroke="var(--safe)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t}
          </span>
        ))}
      </div>


    </header>
  );
}
