import PageHeader from "../components/common/PageHeader.jsx";
import LogAnalyzer from "../components/tools/LogAnalyzer.jsx";
import { useLogAnalyzer } from "../hooks/useLogAnalyzer.js";

export default function LogAnalyzerPage({ onToast }) {
  const { status, result, error, analyze, reset } = useLogAnalyzer();

  return (
    <>
      <PageHeader
        icon="📊"
        title="Threat Analysis Dashboard"
        description="Upload raw server, firewall, or application logs. Let the AI hunt for anomalies, detect injection attempts, and provide actionable remediation steps."
      />
      <LogAnalyzer
        status={status}
        result={result}
        error={error}
        onAnalyze={analyze}
        onReset={reset}
        onToast={onToast}
      />
    </>
  );
}
