import { jsPDF } from "jspdf";
import {
  getMeta,
  formatDateTime,
  reportFileStem,
  downloadBlob,
  VERDICT_COLORS,
} from "./reportMeta.js";
import { buildReportHtml } from "./reportHtml.js";
import { buildReportText } from "./report.js";

const SEV = { HIGH: [239, 68, 68], MEDIUM: [245, 158, 11], LOW: [100, 116, 139] };
const STATUS = { PASS: [16, 185, 129], WARN: [245, 158, 11], FAIL: [239, 68, 68] };

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ------------------------------------------------------------------ */
/* PDF — one-click, vector text, branded                               */
/* ------------------------------------------------------------------ */
export function exportResultToPdf(result) {
  const meta = getMeta(result);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;
  const CW = W - M * 2;
  let y = 0;

  const vColor = hexToRgb(VERDICT_COLORS[result.verdict] || "#f59e0b");

  const ensure = (space) => {
    if (y + space > H - 50) {
      doc.addPage();
      y = M;
    }
  };

  const heading = (text) => {
    ensure(36);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(108, 99, 255);
    doc.text(text.toUpperCase(), M, y);
    y += 6;
    doc.setDrawColor(230, 233, 245);
    doc.setLineWidth(1);
    doc.line(M, y, M + CW, y);
    y += 14;
  };

  const paragraph = (text, color = [51, 65, 85], size = 10.5) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CW);
    lines.forEach((ln) => {
      ensure(size + 4);
      doc.text(ln, M, y);
      y += size + 4;
    });
  };

  /* --- Header band --- */
  doc.setFillColor(76, 70, 229);
  doc.rect(0, 0, W, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CyberLens", M, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Threat Analysis Report", M, 60);
  doc.setFontSize(9);
  doc.text(meta.reportId, W - M, 36, { align: "right" });
  doc.text(`Generated: ${formatDateTime(meta.scannedAt)}`, W - M, 50, { align: "right" });
  doc.text("CONFIDENTIAL", W - M, 64, { align: "right" });
  y = 118;

  /* --- Verdict + score box --- */
  ensure(70);
  doc.setFillColor(vColor[0], vColor[1], vColor[2]);
  doc.setGState && doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.roundedRect(M, y, CW, 64, 8, 8, "F");
  doc.setGState && doc.setGState(new doc.GState({ opacity: 1 }));
  doc.setDrawColor(vColor[0], vColor[1], vColor[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(M, y, CW, 64, 8, 8, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(vColor[0], vColor[1], vColor[2]);
  doc.text(result.verdict, M + 16, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(String(result.score), M + CW - 16, y + 28, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("/ 100 RISK", M + CW - 16, y + 42, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const sumLines = doc.splitTextToSize(result.summary || "", CW - 130);
  doc.text(sumLines.slice(0, 2), M + 16, y + 46);
  y += 80;

  /* --- Analyzed content --- */
  heading("Analyzed Content");
  doc.setFillColor(248, 250, 252);
  const inputText = (meta.input || "(not recorded)").slice(0, 900);
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  const inLines = doc.splitTextToSize(inputText, CW - 20).slice(0, 12);
  const boxH = inLines.length * 12 + 16;
  ensure(boxH);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(M, y, CW, boxH, 6, 6, "FD");
  doc.setTextColor(71, 85, 105);
  let ty = y + 16;
  inLines.forEach((ln) => {
    doc.text(ln, M + 10, ty);
    ty += 12;
  });
  y += boxH + 6;

  /* --- Detailed analysis --- */
  heading("Detailed Analysis");
  (result.explanation || "No additional detail provided.")
    .split(/\n{2,}/)
    .filter(Boolean)
    .forEach((p) => {
      paragraph(p);
      y += 4;
    });

  /* --- Red flags --- */
  if (result.red_flags?.length) {
    heading(`Red Flags (${result.red_flags.length})`);
    result.red_flags.forEach((f) => {
      const detailLines = doc.splitTextToSize(f.detail || "", CW - 70);
      const rowH = Math.max(20, detailLines.length * 12 + 18);
      ensure(rowH);
      const c = SEV[f.severity] || SEV.LOW;
      doc.setFillColor(c[0], c[1], c[2]);
      doc.roundedRect(M, y, 52, 15, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(f.severity || "LOW", M + 26, y + 10.5, { align: "center" });

      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text(f.flag || "", M + 62, y + 11);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      let dy = y + 24;
      detailLines.forEach((ln) => {
        doc.text(ln, M + 62, dy);
        dy += 12;
      });
      y += rowH + 4;
    });
  }

  /* --- Threat signals --- */
  if (result.signals?.length) {
    heading("Threat Signals");
    result.signals.forEach((s) => {
      const detailLines = doc.splitTextToSize(s.detail || "", CW - 70);
      const rowH = Math.max(16, detailLines.length * 11 + 14);
      ensure(rowH);
      const c = STATUS[s.status] || STATUS.WARN;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(c[0], c[1], c[2]);
      doc.text(s.status || "", M, y + 10);
      doc.setTextColor(30, 41, 59);
      doc.text(s.name || "", M + 48, y + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      let dy = y + 10;
      detailLines.forEach((ln, i) => {
        doc.text(ln, M + 200, dy + i * 11);
      });
      y += rowH;
    });
  }

  /* --- VirusTotal --- */
  heading("Security Vendors");
  const vt = result.virustotal || {};
  if (vt.checked) {
    const detected = (vt.malicious || 0) + (vt.suspicious || 0);
    paragraph(
      `VirusTotal: ${detected} / ${vt.total_engines || 72} security engines flagged this as a threat.`,
      [30, 41, 59],
      11
    );
    if (vt.flagged_by?.length) {
      paragraph("Flagged by: " + vt.flagged_by.slice(0, 8).join(", "), [185, 28, 28], 9.5);
    }
  } else {
    paragraph(vt.note || "No URLs were found to check.", [100, 116, 139]);
  }

  /* --- Additional APIs --- */
  if (result.additional_apis) {
    Object.values(result.additional_apis).filter(Boolean).forEach(api => {
      ensure(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10.5);
      y += 8;
      doc.text(`${api.name}:`, M, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(api.note || "", M + 120, y);
      y += 6;
    });
  }

  /* --- Recommendations --- */
  if (result.recommendation?.length) {
    heading("Recommended Actions");
    result.recommendation.forEach((r, i) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(108, 99, 255);
      doc.setFontSize(10.5);
      ensure(18);
      doc.text(`${i + 1}.`, M, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(r, CW - 20);
      lines.forEach((ln, j) => {
        if (j > 0) ensure(15);
        doc.text(ln, M + 18, y);
        y += 14;
      });
      y += 4;
    });
  }

  /* --- Footer on every page --- */
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.line(M, H - 36, W - M, H - 36);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Generated by CyberLens · Powered by Google Gemini + VirusTotal",
      M,
      H - 22
    );
    doc.text(`Page ${p} of ${pages}`, W - M, H - 22, { align: "right" });
  }

  doc.save(`${reportFileStem(result)}.pdf`);
}

/* ------------------------------------------------------------------ */
/* Word (.doc) — one-click, opens in Word / Google Docs                */
/* ------------------------------------------------------------------ */
export function exportResultToWord(result) {
  const html = buildReportHtml(result);
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  downloadBlob(blob, `${reportFileStem(result)}.doc`);
}

/* ------------------------------------------------------------------ */
/* Print — opens the styled report and triggers the print dialog       */
/* ------------------------------------------------------------------ */
export function printResult(result) {
  const html = buildReportHtml(result);
  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    try {
      w.print();
    } catch {
      /* user can print manually */
    }
  }, 500);
  return true;
}

/* ------------------------------------------------------------------ */
/* Email — opens the user's mail client pre-filled                     */
/* ------------------------------------------------------------------ */
export function emailResult(result) {
  const meta = getMeta(result);
  const subject = `CyberLens Report — ${result.verdict} (${meta.reportId})`;
  // mailto bodies are length-limited; keep it concise.
  const body = buildReportText(result).slice(0, 1600);
  window.location.href = `mailto:?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
