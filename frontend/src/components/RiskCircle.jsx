// src/components/RiskCircle.jsx
import { useEffect, useState } from "react";

function RiskCircle({ risk }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setProgress(risk), 300);
  }, [risk]);

  const circumference = 2 * Math.PI * 85;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto" }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
        />
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke={risk > 50 ? "#ef4444" : risk > 30 ? "#f59e0b" : "#22c55e"}
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "42px", fontWeight: "700", lineHeight: 1 }}>
          {risk}%
        </div>
        <div style={{ fontSize: "14px", color: "#64748b" }}>ความเสี่ยง</div>
      </div>
    </div>
  );
}

export default RiskCircle;