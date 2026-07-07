// src/components/BMIBadge.jsx

function getBMIInfo(bmi) {
  if (bmi <= 0) return { label: "—", category: "ยังไม่มีข้อมูล", color: "bmi-none" };
  if (bmi < 18.5) return { label: bmi.toFixed(1), category: "น้ำหนักน้อย", color: "bmi-under" };
  if (bmi < 23) return { label: bmi.toFixed(1), category: "น้ำหนักปกติ", color: "bmi-normal" };
  if (bmi < 27.5) return { label: bmi.toFixed(1), category: "น้ำหนักเกิน", color: "bmi-over" };
  return { label: bmi.toFixed(1), category: "โรคอ้วน", color: "bmi-obese" };
}

function BMIBadge({ bmi }) {
  const info = getBMIInfo(bmi);

  return (
    <div className="bmi-display">
      <div className="bmi-left">
        <div className="bmi-label-text">ดัชนีมวลกาย (BMI)</div>
        <div className="bmi-value">{info.label}</div>
      </div>
      <span className={`bmi-badge ${info.color}`}>{info.category}</span>
    </div>
  );
}

export default BMIBadge;