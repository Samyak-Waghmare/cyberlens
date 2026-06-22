import { useEffect, useState } from "react";

const STEPS = [
  { label: "Extracting URLs and domains...", target: 20 },
  { label: "Checking VirusTotal blacklists...", target: 45 },
  { label: "Analyzing with AI threat intelligence...", target: 75 },
  { label: "Generating danger report...", target: 95 },
  { label: "Finalizing results...", target: 100 },
];

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 0;
    setProgress(STEPS[0].target);
    const timer = setInterval(() => {
      i += 1;
      if (i < STEPS.length) {
        setStepIndex(i);
        setProgress(STEPS[i].target);
      } else {
        clearInterval(timer);
      }
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="loading card" aria-live="polite" style={{ overflow: "hidden", position: "relative" }}>
      {/* Radar UI */}
      <div className="radar-bg" aria-hidden="true" />
      <div className="radar-lines" aria-hidden="true" />

      <div className="loading-content" style={{ position: "relative", zIndex: 1 }}>
        <div className="loading-spinner" aria-hidden="true" />
        <p className="loading-label">{STEPS[stepIndex].label}</p>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-pct">{progress}%</span>

      <ul className="loading-steps">
        {STEPS.map((s, idx) => (
          <li
            key={s.label}
            className={idx < stepIndex ? "done" : idx === stepIndex ? "active" : ""}
          >
            <span className="step-dot" />
            {s.label}
          </li>
        ))}
      </ul>
      </div>

      <div className="skeleton-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", opacity: 0.5, marginTop: "2rem", position: "relative", zIndex: 1 }}>
         {/* Verdict Banner Skeleton */}
         <div style={{ height: "100px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite" }}></div>
         
         {/* Risk Meter and Signals Skeletons */}
         <div style={{ display: "flex", gap: "1rem" }}>
           <div style={{ height: "180px", flex: 1, borderRadius: "12px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite 0.2s" }}></div>
           <div style={{ height: "180px", flex: 1, borderRadius: "12px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite 0.4s" }}></div>
         </div>
         
         {/* Text block Skeleton */}
         <div style={{ height: "20px", width: "100%", borderRadius: "4px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite 0.6s" }}></div>
         <div style={{ height: "20px", width: "80%", borderRadius: "4px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite 0.7s" }}></div>
      </div>

    </section>
  );
}
