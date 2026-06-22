import { useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAnalyzer } from "../hooks/useAnalyzer.js";
import { useScanHistory } from "../hooks/useScanHistory.js";
import PageHeader from "../components/common/PageHeader.jsx";
import ScamAnalyzer from "../components/tools/ScamAnalyzer.jsx";

export default function AnalyzerPage({ onToast }) {
  const { history, addScan, clearHistory } = useScanHistory();
  const { status, result, analyze, showResult, reset } = useAnalyzer({ onComplete: addScan });
  const resultRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const targetUrl = searchParams.get("url");
    if (targetUrl) {
      // Auto-analyze URL from Chrome Extension
      analyze(targetUrl);
      
      // Clean up URL so refresh doesn't trigger scan again
      searchParams.delete("url");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, analyze]);

  const handleReset = useCallback(() => {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reset]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    onToast?.("Scan history cleared", "info");
  }, [clearHistory, onToast]);

  return (
    <>
      <PageHeader
        icon="🛡️"
        title="Scam Analyzer"
        description="Paste any URL, email, SMS, or message. Our AI + VirusTotal engine will tell you exactly why it's dangerous or safe — in seconds."
      />
      <ScamAnalyzer
        status={status}
        result={result}
        analyze={analyze}
        onReset={handleReset}
        onToast={onToast}
        history={history}
        onViewHistory={(item) => showResult(item.result)}
        onClearHistory={handleClearHistory}
        resultRef={resultRef}
      />
    </>
  );
}
