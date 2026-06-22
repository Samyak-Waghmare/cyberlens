import { useCallback, useState } from "react";
import { analyzeInput } from "../services/api.js";
import { makeReportMeta } from "../utils/reportMeta.js";
import { runHeuristics } from "../utils/heuristics.js";
import { buildLocalResult } from "../utils/localAnalysis.js";

const MIN_LOADING_MS = 3000; // let the loading animation fully play

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Owns the analysis lifecycle: status, result, and error.
 * status: "idle" | "loading" | "done"
 *
 * Resilience: every scan runs the offline heuristic engine first, so even if
 * the AI service fails we still return a useful local report ("degraded" mode)
 * instead of a dead error.
 */
export function useAnalyzer({ onComplete } = {}) {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = useCallback(
    async (input, fileHash = null) => {
      setStatus("loading");
      setError("");
      setResult(null);

      const meta = makeReportMeta(input);
      const startedAt = Date.now();

      try {
        const data = await analyzeInput(input, fileHash);

        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_LOADING_MS) await delay(MIN_LOADING_MS - elapsed);

        // Merge AI result with offline heuristics (used for Scam DNA highlights).
        const enriched = { ...data, meta, heuristics: runHeuristics(input) };
        setResult(enriched);
        setStatus("done");
        onComplete?.(input, enriched);
      } catch (err) {
        // Graceful degradation: fall back to the offline engine.
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_LOADING_MS) await delay(MIN_LOADING_MS - elapsed);

        const local = buildLocalResult(input, meta);
        local.aiError = err.message || "AI service unavailable.";
        setResult(local);
        setStatus("done");
        onComplete?.(input, local);
      }
    },
    [onComplete]
  );

  const showResult = useCallback((data) => {
    setResult(data);
    setStatus("done");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError("");
  }, []);

  return { status, result, error, analyze, showResult, reset };
}
