/** Shared helpers for building report metadata + downloads. */

/** Create stable metadata for a single scan (report id, timestamp, source). */
export function makeReportMeta(input) {
  const now = Date.now();
  return {
    input,
    scannedAt: now,
    reportId:
      "ASR-" +
      now.toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase(),
  };
}

/** Read metadata off a result, with safe fallbacks for older history items. */
export function getMeta(result) {
  const m = result?.meta || {};
  return {
    input: m.input || "",
    scannedAt: m.scannedAt || Date.now(),
    reportId: m.reportId || "ASR-LEGACY",
  };
}

export function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return new Date(ts).toString();
  }
}

/** A safe filename stem for a report, e.g. "AI-Scam-Shield-Report-ASR-XXXX". */
export function reportFileStem(result) {
  const { reportId } = getMeta(result);
  return `AI-Scam-Shield-Report-${reportId}`;
}

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const VERDICT_COLORS = {
  SAFE: "#10b981",
  SUSPICIOUS: "#f59e0b",
  DANGEROUS: "#ef4444",
};
