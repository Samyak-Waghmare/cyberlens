import { useCallback, useEffect, useState } from "react";

const HISTORY_KEY = "cyberLensHistory";
const MAX_ITEMS = 5;

function load() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

/** Persist the last few scans in localStorage. */
export function useScanHistory() {
  const [history, setHistory] = useState(load);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addScan = useCallback((input, result) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      input,
      verdict: result.verdict,
      timestamp: Date.now(),
      result,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ITEMS));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addScan, clearHistory };
}
