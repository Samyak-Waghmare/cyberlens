export default function RedFlags({ flags = [] }) {
  if (!flags.length) return null;

  return (
    <ul className="red-flags">
      {flags.map((f, i) => (
        <li className="red-flag" key={i}>
          <span className={`severity sev-${(f.severity || "").toLowerCase()}`}>
            {f.severity}
          </span>
          <span className="flag-body">
            <strong>{f.flag}</strong>
            <span className="flag-detail"> — {f.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
