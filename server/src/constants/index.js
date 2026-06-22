/** Minimum characters required before we bother analyzing. */
export const MIN_INPUT_LENGTH = 10;

/** Matches http(s):// and bare www. URLs in arbitrary text. */
export const URL_REGEX = /\b(?:https?:\/\/|www\.)[^\s<>"')]+/gi;

/** Allowed verdict values returned to the client. */
export const VERDICTS = ["SAFE", "SUSPICIOUS", "DANGEROUS"];

/** VirusTotal detection categories we treat as a "hit". */
export const VT_FLAG_CATEGORIES = ["malicious", "suspicious"];
