import { VERDICT_META } from "../../constants/verdicts.js";

export default function VerdictBanner({ verdict, summary }) {
  const meta = VERDICT_META[verdict] || VERDICT_META.SUSPICIOUS;

  return (
    <div className={`verdict-banner ${meta.cls}`}>
      <span className="verdict-icon">{meta.icon}</span>
      <div className="verdict-text">
        <span className="verdict-label">{meta.label}</span>
        <span className="verdict-summary">{summary}</span>
      </div>
    </div>
  );
}
