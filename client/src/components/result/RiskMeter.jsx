import { useEffect, useState } from "react";

function colorFor(score) {
  if (score <= 30) return "var(--safe)";
  if (score <= 60) return "var(--warn)";
  return "var(--danger)";
}

export default function RiskMeter({ score = 0 }) {
  const [animated, setAnimated] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const color = colorFor(score);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="risk-meter">
      <svg viewBox="0 0 180 180" width="180" height="180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--border)" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.4s ease" }}
        />
        <text x="90" y="84" textAnchor="middle" className="meter-score" fill={color}>
          {Math.round(animated)}
        </text>
        <text x="90" y="108" textAnchor="middle" className="meter-caption">
          / 100 risk
        </text>
      </svg>
    </div>
  );
}
