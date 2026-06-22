import { useCallback, useState } from "react";
import { analyzeLogData } from "../services/api.js";

const MIN_LOADING_MS = 2500;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useLogAnalyzer() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = useCallback(async (logs) => {
    setStatus("loading");
    setError("");
    setResult(null);

    const startedAt = Date.now();

    try {
      const data = await analyzeLogData(logs);

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) await delay(MIN_LOADING_MS - elapsed);

      setResult(data);
      setStatus("done");
    } catch (err) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) await delay(MIN_LOADING_MS - elapsed);

      setError(err.message || "Failed to analyze logs.");
      setStatus("done");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError("");
  }, []);

  return { status, result, error, analyze, reset };
}
