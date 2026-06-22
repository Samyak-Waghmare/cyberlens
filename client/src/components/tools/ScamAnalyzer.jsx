import AnalyzerInput from "../analyzer/AnalyzerInput.jsx";
import LoadingState from "../analyzer/LoadingState.jsx";
import ResultCard from "../result/ResultCard.jsx";
import ScanHistory from "../history/ScanHistory.jsx";

export default function ScamAnalyzer({
  status,
  result,
  analyze,
  onReset,
  onToast,
  history,
  onViewHistory,
  onClearHistory,
  resultRef,
}) {
  return (
    <>
      {status !== "loading" && status !== "done" && (
        <AnalyzerInput onAnalyze={analyze} disabled={status === "loading"} onToast={onToast} />
      )}

      <div ref={resultRef}>
        {status === "loading" && <LoadingState />}
        {status === "done" && result && (
          <div className="fade-in">
            <ResultCard
              result={result}
              onReset={onReset}
              onToast={onToast}
              onRetryAI={analyze}
            />
          </div>
        )}
      </div>

      <ScanHistory history={history} onView={onViewHistory} onClear={onClearHistory} />
    </>
  );
}
