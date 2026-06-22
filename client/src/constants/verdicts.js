/** Shared verdict styling metadata used across result + history views. */

export const VERDICT_META = {
  SAFE: { cls: "safe", icon: "🛡️", label: "SAFE" },
  SUSPICIOUS: { cls: "warn", icon: "⚠️", label: "SUSPICIOUS" },
  DANGEROUS: { cls: "danger", icon: "🚨", label: "DANGEROUS" },
};

export const SIGNAL_STATUS_META = {
  PASS: { icon: "✓", cls: "pass" },
  WARN: { icon: "⚠", cls: "warn" },
  FAIL: { icon: "✗", cls: "fail" },
};

export const RISK_BANDS = [
  { dot: "safe", label: "0–30 Safe" },
  { dot: "warn", label: "31–60 Suspicious" },
  { dot: "danger", label: "61–100 Dangerous" },
];
