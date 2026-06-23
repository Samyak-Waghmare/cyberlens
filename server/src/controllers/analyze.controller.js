import { analyzeContent } from "../services/analysis.service.js";
import { incrementActiveScans, decrementActiveScans, incrementThreatsBlocked, addGlobalAlert, addLog } from "../services/stats.service.js";

/** POST /api/analyze — run the full threat-analysis pipeline. */
export async function analyze(req, res) {
  incrementActiveScans();
  try {
    // req.validatedInput is provided by our validation middleware
    const result = await analyzeContent(req.validatedInput || req.body.input, req.body.fileHash);
    
    if (result.status === "DANGEROUS" || result.status === "SUSPICIOUS") {
      incrementThreatsBlocked();
      if (result.score >= 80) addGlobalAlert();
      addLog("CRITICAL", `Threat intercepted: ${result.status} (${result.score}/100)`, result.status, "var(--danger)");
    } else {
      addLog("INFO", "Clean scan: No threats detected.", "SAFE", "var(--success)");
    }
    
    res.json(result);
  } catch (error) {
    addLog("ERROR", `Scan failed: ${error.message}`, "ERROR", "var(--danger)");
    res.status(500).json({ error: "Analysis failed. Ensure API keys are configured." });
  } finally {
    decrementActiveScans();
  }
}
