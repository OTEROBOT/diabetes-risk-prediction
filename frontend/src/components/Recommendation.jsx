// src/components/Recommendation.jsx
function Recommendation({ risk }) {
  const recommendations = risk > 50 ? [
    "พบแพทย์เพื่อตรวจระดับน้ำตาลในเลือด",
    "ลดน้ำหนักและควบคุมอาหาร",
    "เดินวันละ 30 นาที",
    "ลดการบริโภคอาหารหวานและเครื่องดื่มหวาน",
    "ตรวจสุขภาพประจำปี"
  ] : [
    "รักษาสุขภาพดีต่อไป",
    "ออกกำลังกายสม่ำเสมอ",
    "รับประทานผักและผลไม้ให้เพียงพอ",
    "หลีกเลี่ยงการสูบบุหรี่และแอลกอฮอล์",
  ];

  return (
    <div style={{ marginTop: "25px" }}>
      <h3 style={{ color: "#1e40af", marginBottom: "12px" }}>💡 คำแนะนำจาก AI</h3>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.7" }}>
        {recommendations.map((rec, i) => (
          <li key={i}>✓ {rec}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendation;