import { SIGNAL_STATUS_META } from "../../constants/verdicts.js";

export default function ThreatSignals({ signals = [] }) {
  if (!signals.length) return null;

  return (
    <div className="signals-grid">
      {signals.map((s, i) => {
        const meta = SIGNAL_STATUS_META[s.status] || SIGNAL_STATUS_META.WARN;
        return (
          <div className={`signal-card ${meta.cls}`} key={`${s.name}-${i}`}>
            <div className="signal-head">
              <span className="signal-name">{s.name}</span>
              <span className={`signal-status ${meta.cls}`}>
                {meta.icon} {s.status}
              </span>
            </div>
            <p className="signal-detail">{s.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
