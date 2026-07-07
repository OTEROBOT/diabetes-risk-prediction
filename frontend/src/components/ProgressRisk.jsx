// src/components/ProgressRisk.jsx
function ProgressRisk({ risk }) {
  const getColor = () => {
    if (risk >= 70) return "#ef4444";
    if (risk >= 40) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
        <span>ระดับความเสี่ยง</span>
        <span style={{ fontWeight: "600", color: getColor() }}>{risk}%</span>
      </div>
      <div
        style={{
          height: "12px",
          background: "#e2e8f0",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${risk}%`,
            height: "100%",
            background: getColor(),
            borderRadius: "9999px",
            transition: "width 1.2s ease",
          }}
        />
      </div>
    </div>
  );
}

export default ProgressRisk;