import { useEffect, useState } from "react";
import { collectFingerprint } from "../../utils/fingerprint.js";
import { fetchIpInfo } from "../../services/ipinfo.js";

const RISK_LABEL = { high: "High exposure", med: "Moderate", low: "Minor", good: "Protective" };

function scoreVerdict(score) {
  if (score >= 70) return { label: "Highly trackable", color: "var(--danger)" };
  if (score >= 45) return { label: "Moderately trackable", color: "var(--warn)" };
  return { label: "Relatively private", color: "var(--safe)" };
}

export default function PrivacyCheckup() {
  const [fp, setFp] = useState(null);
  const [ip, setIp] = useState(null);
  const [ipLoading, setIpLoading] = useState(true);

  useEffect(() => {
    setFp(collectFingerprint());
    fetchIpInfo()
      .then(setIp)
      .finally(() => setIpLoading(false));
  }, []);

  if (!fp) return null;
  const verdict = scoreVerdict(fp.score);

  return (
    <section className="tool card" id="scanner">
      <div className="privacy-score" style={{ borderColor: verdict.color }}>
        <div className="ps-num" style={{ color: verdict.color }}>{fp.score}</div>
        <div className="ps-body">
          <strong style={{ color: verdict.color }}>{verdict.label}</strong>
          <span>Exposure score — lower is more private.</span>
        </div>
      </div>

      {/* IP / location */}
      <div className="ip-card">
        <h3 className="block-title">🌍 Your public identity</h3>
        {ipLoading ? (
          <p className="vt-note">Looking up your IP…</p>
        ) : ip ? (
          <div className="ip-grid">
            <div><span className="ip-k">IP address</span><span className="ip-v mono">{ip.ip}</span></div>
            <div><span className="ip-k">Location</span><span className="ip-v">{[ip.city, ip.region, ip.country].filter(Boolean).join(", ")} {ip.flag || ""}</span></div>
            <div><span className="ip-k">Provider</span><span className="ip-v">{ip.isp || "Unknown"}</span></div>
          </div>
        ) : (
          <p className="vt-note">Couldn't determine your IP (a privacy blocker may be active — good!).</p>
        )}
      </div>

      {/* Fingerprint signals */}
      <div className="result-block">
        <h3 className="block-title">🔬 Fingerprint signals ({fp.items.length})</h3>
        <div className="fp-grid">
          {fp.items.map((it) => (
            <div className={`fp-item risk-${it.risk}`} key={it.key} title={it.tip}>
              <div className="fp-top">
                <span className="fp-label">{it.label}</span>
                <span className={`fp-risk risk-${it.risk}`}>{RISK_LABEL[it.risk]}</span>
              </div>
              <span className="fp-value mono">{it.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result-block recommendation">
        <h3 className="block-title">How to reduce your footprint</h3>
        <ul className="recommend-list">
          <li>Use a privacy-focused browser (Brave, Firefox) or anti-fingerprint extensions.</li>
          <li>Use a trustworthy VPN to hide your IP and approximate location.</li>
          <li>Enable "Do Not Track" and block third-party cookies in your browser settings.</li>
          <li>Keep your browser updated and avoid unnecessary extensions that can be fingerprinted.</li>
        </ul>
      </div>

      <p className="privacy-note">
        🔒 Everything here is computed locally in your browser. CyberLens does not store
        or transmit any of it.
      </p>
    </section>
  );
}
