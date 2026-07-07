// src/components/ResultCard.jsx
import RiskCircle from "./RiskCircle";
import ProgressRisk from "./ProgressRisk";

const AGE_LABELS = ["", "18–24", "25–29", "30–34", "35–39", "40–44", "45–49",
  "50–54", "55–59", "60–64", "65–69", "70–74", "75–79", "80+"];

function getBMICategory(bmi) {
  if (bmi < 18.5) return "น้ำหนักน้อย";
  if (bmi < 23) return "น้ำหนักปกติ";
  if (bmi < 27.5) return "น้ำหนักเกิน";
  return "โรคอ้วน";
}

function getTips(form) {
  const tips = [];

  if (form.BMI >= 27.5) {
    tips.push({ type: "warn", title: "ควบคุมน้ำหนัก", desc: `BMI ${form.BMI.toFixed(1)} — เกินเกณฑ์มาตรฐาน` });
  } else {
    tips.push({ type: "good", title: "น้ำหนักดี", desc: `BMI ${form.BMI.toFixed(1)} — อยู่ในเกณฑ์ปกติ` });
  }

  if (form.HighBP) {
    tips.push({ type: "bad", title: "ควบคุมความดัน", desc: "ความดันสูงเพิ่มความเสี่ยงโรคเบาหวาน" });
  }

  if (!form.PhysActivity) {
    tips.push({ type: "warn", title: "เพิ่มการออกกำลังกาย", desc: "ออกกำลังกาย 30 นาที/วัน ลดความเสี่ยงได้มาก" });
  } else {
    tips.push({ type: "good", title: "ออกกำลังกายดี", desc: "รักษาพฤติกรรมนี้ต่อเนื่อง" });
  }

  if (form.Smoker) {
    tips.push({ type: "bad", title: "หยุดสูบบุหรี่", desc: "เพิ่มความเสี่ยงโรคเบาหวานอย่างมีนัยสำคัญ" });
  }

  if (!form.Fruits || !form.Veggies) {
    tips.push({ type: "warn", title: "ปรับโภชนาการ", desc: "รับประทานผักและผลไม้ทุกวัน" });
  } else {
    tips.push({ type: "good", title: "โภชนาการดี", desc: "รับประทานผักผลไม้สม่ำเสมอ" });
  }

  return tips.slice(0, 4);
}

function ResultCard({ result, form }) {
  if (!result) return null;

  const pct = Math.round((result.probability || result.risk_probability || 0) * 100);
  const isHigh = pct > 50;
  const tips = getTips(form);

  return (
    <div className={`result-card ${isHigh ? "result-high" : "result-low"}`}>
      {/* Hero */}
      <div className="result-hero">

        <RiskCircle risk={pct} />

        <ProgressRisk risk={pct} />

        <div className={`result-pct ${isHigh ? "text-danger" : "text-success"}`}>
          {pct}%
        </div>

        <div className={`result-risk-label ${isHigh ? "text-danger" : "text-success"}`}>
          {isHigh ? "ความเสี่ยงสูง" : "ความเสี่ยงต่ำ"}
        </div>

        <div className="result-progress-wrap">
          <div
            className={`result-progress-bar ${isHigh ? "bar-high" : "bar-low"}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className={`result-sub ${isHigh ? "text-danger" : "text-success"}`}>
          {isHigh
            ? "แนะนำปรึกษาแพทย์เพื่อตรวจเพิ่มเติม"
            : "ดูแลสุขภาพต่อเนื่องเพื่อรักษาระดับนี้"}
        </p>
      </div>

      {/* Details */}
      <div className="result-details">
        <div className="result-row">
          <span className="result-key">BMI</span>
          <span className="result-val">{form.BMI.toFixed(1)} — {getBMICategory(form.BMI)}</span>
        </div>
        <div className="result-row">
          <span className="result-key">กลุ่มอายุ</span>
          <span className="result-val">{AGE_LABELS[form.Age]} ปี</span>
        </div>
        <div className="result-row">
          <span className="result-key">ความดันโลหิต</span>
          <span className="result-val">{form.HighBP ? "มีความดันสูง" : "ปกติ"}</span>
        </div>
        <div className="result-row">
          <span className="result-key">การออกกำลังกาย</span>
          <span className="result-val">{form.PhysActivity ? "สม่ำเสมอ" : "ไม่สม่ำเสมอ"}</span>
        </div>

        {/* Tips */}
        <div className="tips-label">คำแนะนำ</div>
        <div className="tips-grid">
          {tips.map((tip, i) => (
            <div className={`tip-item tip-${tip.type}`} key={i}>
              <div className={`tip-dot dot-${tip.type}`} />
              <div>
                <div className="tip-title">{tip.title}</div>
                <div className="tip-desc">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="result-disclaimer">
          ⓘ ผลการประเมินนี้เป็นการคาดการณ์เบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์
          ควรพบแพทย์เพื่อการตรวจอย่างละเอียด
        </div>
      </div>
    </div>
  );
}

export default ResultCard;