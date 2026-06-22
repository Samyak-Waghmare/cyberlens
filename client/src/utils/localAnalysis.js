import { runHeuristics } from "./heuristics.js";

const RECS = {
  SAFE: [
    "No obvious scam indicators were found, but stay cautious with unexpected messages.",
    "Never share passwords or one-time codes, even if a message looks legitimate.",
    "When in doubt, contact the company directly using their official website.",
  ],
  SUSPICIOUS: [
    "Do not click any links or download attachments until you can verify the sender.",
    "Independently look up the organization and contact them through official channels.",
    "Never enter passwords, OTPs, or payment details from a link in this message.",
  ],
  DANGEROUS: [
    "Do NOT click any links, reply, or share any personal or financial information.",
    "Delete the message and, if it impersonates a company, report it to them directly.",
    "If you already interacted, change your passwords and alert your bank immediately.",
  ],
};

function summarize(heur) {
  const n = heur.findings.length;
  if (heur.level === "SAFE") {
    return "Offline checks found no strong scam indicators in this content.";
  }
  return `Offline analysis flagged ${n} risk indicator${n === 1 ? "" : "s"} consistent with a ${heur.level.toLowerCase()} scam.`;
}

/**
 * Build a complete, renderable result purely from the offline engine.
 * Used as a graceful fallback when the AI service is unavailable.
 */
export function buildLocalResult(input, meta) {
  const heur = runHeuristics(input);
  return {
    verdict: heur.level,
    score: heur.score,
    summary: summarize(heur),
    explanation:
      "This report was produced by CyberLens's offline heuristic engine because the AI service was temporarily unavailable. " +
      "It inspects links, domains, and language for well-known scam patterns. " +
      "For an even deeper, context-aware analysis, retry the full AI scan in a moment.",
    red_flags: heur.findings,
    signals: heur.signals,
    recommendation: RECS[heur.level],
    virustotal: { checked: false, note: "Offline mode — VirusTotal lookup skipped." },
    heuristics: heur,
    meta,
    degraded: true,
  };
}
