import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

const NAV_TOOLS = [
  { to: "/analyzer", label: "Analyzer" },
  { to: "/password", label: "Passwords" },
  { to: "/privacy",  label: "Privacy" },
  { to: "/website",  label: "Inspector" },
  { to: "/dojo",     label: "Phishing Dojo" },
  { to: "/logs",     label: "Threat Logs" },
  { to: "/extension",label: "Extension" },
];

const LensMark = () => (
  <svg className="brand-logo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" fill="var(--accent)" fillOpacity="0.15"/>
    <circle cx="12" cy="12" r="4" stroke="var(--accent)" strokeWidth="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <Link className="brand" to="/" aria-label="CyberLens home">
          <LensMark />
          <span className="brand-name glitch-hover">
            Cyber<span className="grad-text">Lens</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links nav-links-desktop">
          {NAV_TOOLS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-tool-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://github.com/Samyak-Waghmare/cyberlens"
            target="_blank"
            rel="noreferrer"
            className="nav-cta"
          >
            GitHub ↗
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="nav-hamburger"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-menu">
          {NAV_TOOLS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://github.com/Samyak-Waghmare/cyberlens"
            target="_blank"
            rel="noreferrer"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            GitHub ↗
          </a>
        </div>
      )}
    </nav>
  );
}
