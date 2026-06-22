import { Link } from "react-router-dom";

const LensMark = () => (
  <svg className="brand-logo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" fill="var(--accent)" fillOpacity="0.15"/>
    <circle cx="12" cy="12" r="4" stroke="var(--accent)" strokeWidth="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <LensMark />
            <span className="brand-name glitch-hover">
              Cyber<span className="grad-text">Lens</span>
            </span>
          </div>
          <p className="footer-tagline">
            Paste anything suspicious. Know the truth in seconds.
            Built to protect everyone from modern cyber threats.
          </p>
        </div>

        <div className="footer-col">
          <h4>Tools</h4>
          <Link to="/analyzer">Scam Analyzer</Link>
          <Link to="/logs">Threat Log Analyzer</Link>
          <Link to="/password">Password Lab</Link>
          <Link to="/privacy">Privacy Checkup</Link>
          <Link to="/website">Website Inspector</Link>
          <Link to="/dojo">Phishing Dojo</Link>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <a href="https://github.com/Samyak-Waghmare/cyberlens" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.ic3.gov/" target="_blank" rel="noreferrer">Report to IC3 (US)</a>
          <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">Report Cybercrime (IN)</a>
          <a href="https://www.virustotal.com" target="_blank" rel="noreferrer">VirusTotal</a>
          <a href="https://haveibeenpwned.com" target="_blank" rel="noreferrer">HaveIBeenPwned</a>
          <a href="https://ai.google.dev" target="_blank" rel="noreferrer">Gemini API</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/terms">Terms of Use</Link>
          <button type="button" className="footer-btn-link" onClick={() => window.scrollTo(0, 0)}>Back to top ↑</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} CyberLens · Built for CyberCoders 2026 Hackathon</p>
        <p className="footer-powered">
          <span>⚡</span>
          Powered by Gemini AI · VirusTotal · HaveIBeenPwned · ipwho.is
        </p>
      </div>
    </footer>
  );
}
