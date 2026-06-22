/** Human-friendly relative time, e.g. "3m ago". */
export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString();
}

/** Truncate a string to a max length with an ellipsis. */
export function truncate(str, max = 60) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

/** Best-effort classification of pasted content for a UI hint badge. */
export function detectInputType(text) {
  const t = text.trim();
  if (!t) return null;
  if (/^https?:\/\/|^www\./i.test(t) || /\b[\w-]+\.(com|net|org|io|xyz|tk|co)\b/i.test(t.split(/\s/)[0] || "")) {
    if (t.split(/\s+/).length <= 2 && /^https?:\/\/|^www\./i.test(t)) return "URL";
  }
  if (/^from:|subject:|@[\w.-]+\.\w+/im.test(t)) return "Email";
  if (/^https?:\/\//i.test(t) && t.split(/\s+/).length <= 2) return "URL";
  return "Message";
}
