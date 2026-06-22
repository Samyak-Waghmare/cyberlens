import { getMeta, formatDateTime, VERDICT_COLORS } from "./reportMeta.js";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SEV_COLORS = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#64748b" };
const STATUS_COLORS = { PASS: "#10b981", WARN: "#f59e0b", FAIL: "#ef4444" };

/**
 * Build a fully self-contained, print-ready HTML document for a result.
 * Light theme, A4-friendly — opens cleanly in Word, Google Docs, and print.
 */
export function buildReportHtml(result) {
  const meta = getMeta(result);
  const vColor = VERDICT_COLORS[result.verdict] || "#f59e0b";
  const vt = result.virustotal || {};
  const vtDetected = (vt.malicious || 0) + (vt.suspicious || 0);

  const redFlags = (result.red_flags || [])
    .map(
      (f) => `
      <tr>
        <td style="white-space:nowrap;">
          <span style="background:${SEV_COLORS[f.severity] || "#64748b"};color:#fff;
            font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;">${esc(
              f.severity
            )}</span>
        </td>
        <td><strong>${esc(f.flag)}</strong></td>
        <td style="color:#475569;">${esc(f.detail)}</td>
      </tr>`
    )
    .join("");

  const signals = (result.signals || [])
    .map(
      (s) => `
      <tr>
        <td style="white-space:nowrap;color:${STATUS_COLORS[s.status] || "#64748b"};
          font-weight:700;">${esc(s.status)}</td>
        <td><strong>${esc(s.name)}</strong></td>
        <td style="color:#475569;">${esc(s.detail)}</td>
      </tr>`
    )
    .join("");

  const recs = (result.recommendation || [])
    .map((r) => `<li style="margin-bottom:6px;">${esc(r)}</li>`)
    .join("");

  const vendors = (vt.flagged_by || [])
    .slice(0, 8)
    .map(
      (v) =>
        `<span style="display:inline-block;background:#fee2e2;color:#b91c1c;border:1px solid #fecaca;
          font-size:11px;padding:2px 8px;border-radius:10px;margin:2px;">${esc(v)}</span>`
    )
    .join("");

  const explanationParas = (result.explanation || "")
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 10px;color:#334155;">${esc(p)}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<title>CyberLens — Threat Analysis Report ${esc(meta.reportId)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; font-size: 13px;
    line-height: 1.55; margin: 0; padding: 24px; background: #fff; }
  .wrap { max-width: 760px; margin: 0 auto; }
  .header { background: linear-gradient(120deg,#6c63ff,#4f46e5); color: #fff;
    border-radius: 12px; padding: 22px 24px; display: flex; justify-content: space-between;
    align-items: flex-start; }
  .header h1 { margin: 0; font-size: 22px; letter-spacing: -.4px; }
  .header .sub { opacity: .9; font-size: 13px; margin-top: 2px; }
  .header .meta { text-align: right; font-size: 11px; opacity: .95; }
  .header .meta b { display:block; font-size: 12px; }
  .verdict { margin-top: 18px; border-radius: 10px; padding: 16px 18px;
    border: 2px solid ${vColor}; background: ${vColor}14; display:flex; justify-content:space-between; align-items:center; }
  .verdict .v { font-size: 24px; font-weight: 800; color: ${vColor}; }
  .verdict .s { font-size: 13px; color:#334155; max-width: 60%; }
  .score { text-align:center; }
  .score .n { font-size: 30px; font-weight: 800; color:${vColor}; line-height:1; }
  .score .l { font-size: 10px; color:#64748b; text-transform:uppercase; letter-spacing:.5px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .6px; color:#6c63ff;
    border-bottom: 2px solid #eef2ff; padding-bottom: 6px; margin: 26px 0 12px; }
  .box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px;
    font-family: 'Consolas', monospace; font-size: 12px; color:#475569; white-space: pre-wrap;
    word-break: break-word; max-height: 220px; overflow: hidden; }
  table { width:100%; border-collapse: collapse; font-size: 12.5px; }
  td { padding: 8px 8px; border-bottom: 1px solid #eef2f6; vertical-align: top; }
  ol { margin: 0; padding-left: 20px; color:#334155; }
  .vt-line { font-size: 14px; margin-bottom: 8px; }
  .vt-line b { color:#b91c1c; font-size: 16px; }
  .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px;
    font-size: 11px; color:#94a3b8; display:flex; justify-content:space-between; }
  .conf { display:inline-block; background:#1e293b; color:#fff; font-size:10px; font-weight:700;
    letter-spacing:.5px; padding:3px 8px; border-radius:4px; }
</style></head>
<body><div class="wrap">

  <div class="header">
    <div>
      <h1>🛡️ CyberLens</h1>
      <div class="sub">Threat Analysis Report</div>
    </div>
    <div class="meta">
      <b>${esc(meta.reportId)}</b>
      Generated: ${esc(formatDateTime(meta.scannedAt))}<br/>
      <span class="conf" style="margin-top:6px;">CONFIDENTIAL</span>
    </div>
  </div>

  <div class="verdict">
    <div>
      <div class="v">${esc(result.verdict)}</div>
      <div class="s">${esc(result.summary)}</div>
    </div>
    <div class="score">
      <div class="n">${esc(result.score)}</div>
      <div class="l">/ 100 risk</div>
    </div>
  </div>

  <h2>Analyzed Content</h2>
  <div class="box">${esc((meta.input || "(not recorded)").slice(0, 1200))}</div>

  <h2>Detailed Analysis</h2>
  ${explanationParas || "<p>No additional detail provided.</p>"}

  ${
    redFlags
      ? `<h2>Red Flags (${result.red_flags.length})</h2><table>${redFlags}</table>`
      : ""
  }

  ${
    signals
      ? `<h2>Threat Signals</h2><table>${signals}</table>`
      : ""
  }

  <h2>Security Vendors</h2>
  <div class="card">
    <p>
      <strong>VirusTotal:</strong>
      ${vt.checked ? `${vtDetected} engines flagged this as a threat.` : vt.note || "Not checked."}
    </p>
    ${result.additional_apis ? Object.values(result.additional_apis).filter(Boolean).map(api => `
      <p>
        <strong>${esc(api.name)}:</strong> ${esc(api.note || "Offline check complete.")}
      </p>
    `).join("") : ""}
  </div>
  ${
    vt.checked && vendors ? `<div>${vendors}</div>` : ""
  }

  ${recs ? `<h2>Recommended Actions</h2><ol>${recs}</ol>` : ""}

  <div class="footer">
    <span>Generated by CyberLens · Powered by Google Gemini + VirusTotal</span>
    <span>${esc(meta.reportId)}</span>
  </div>

</div></body></html>`;
}
