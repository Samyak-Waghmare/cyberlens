export default function VirusTotalPanel({ virustotal = {} }) {
  const vt = virustotal;
  const detected = (vt.malicious || 0) + (vt.suspicious || 0);
  const pct = vt.total_engines ? (detected / vt.total_engines) * 100 : 0;

  if (!vt.checked) {
    return <p className="vt-note">{vt.note || "No URLs found to check."}</p>;
  }

  return (
    <div className="vt-box">
      <div className="vt-summary">
        <strong>{detected}</strong> / {vt.total_engines || 72} engines flagged a threat
      </div>

      <div className="progress-track">
        <div className="progress-fill vt" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>

      {vt.flagged_by?.length > 0 ? (
        <div className="vt-vendors">
          {vt.flagged_by.slice(0, 5).map((v) => (
            <span className="vendor-chip" key={v}>
              {v}
            </span>
          ))}
        </div>
      ) : (
        <p className="vt-note">No engines flagged this URL.</p>
      )}
    </div>
  );
}
