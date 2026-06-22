import { VERDICT_META } from "../../constants/verdicts.js";
import { timeAgo, truncate } from "../../utils/format.js";

export default function ScanHistory({ history, onView, onClear }) {
  if (!history.length) return null;

  return (
    <section className="history card">
      <div className="history-head">
        <h3 className="block-title">Recent scans</h3>
        <button type="button" className="clear-btn" onClick={onClear}>
          Clear History
        </button>
      </div>

      <ul className="history-list">
        {history.map((item) => {
          const cls = (VERDICT_META[item.verdict] || VERDICT_META.SUSPICIOUS).cls;
          return (
            <li className="history-item" key={item.id}>
              <span className={`hist-badge ${cls}`}>{item.verdict}</span>
              <span className="hist-input" title={item.input}>
                {truncate(item.input)}
              </span>
              <span className="hist-time">{timeAgo(item.timestamp)}</span>
              <button type="button" className="hist-view" onClick={() => onView(item)}>
                View
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
