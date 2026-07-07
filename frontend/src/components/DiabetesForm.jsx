// src/components/DiabetesForm.jsx
import { useState } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";
import BMIBadge from "./BMIBadge";
import HistoryTable from "./HistoryTable";

function DiabetesForm() {
  const [form, setForm] = useState({
    HighBP: 0,
    BMI: 24.2,
    Smoker: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    HvyAlcoholConsump: 0,
    GenHlth: 3,
    Sex: 1,
    Age: 8,
  });

  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [viewItem, setViewItem] = useState(null);

  const calculateBMI = (w, h) => {
    const wn = parseFloat(w) || 0;
    const hn = parseFloat(h) || 0;
    if (hn <= 0) return 0;
    return +(wn / ((hn / 100) ** 2)).toFixed(1);
  };

  const handleWeight = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    if ((value.match(/\./g) || []).length > 1) {
      value = value.substring(0, value.lastIndexOf(".") + 1) +
        value.substring(value.lastIndexOf(".") + 1).replace(/\./g, "");
    }
    setWeight(value);
    setForm((prev) => ({ ...prev, BMI: calculateBMI(value, height) }));
  };

  const handleHeight = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    setHeight(value);
    setForm((prev) => ({ ...prev, BMI: calculateBMI(weight, value) }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  // mock prediction ใช้เมื่อ server ไม่ตอบสนอง
  const mockPredict = (f) => {
    let score = 0;
    if (f.HighBP) score += 20;
    if (f.BMI > 27.5) score += 15;
    if (f.BMI > 30) score += 10;
    if (f.Smoker) score += 10;
    if (!f.PhysActivity) score += 8;
    if (!f.Fruits) score += 4;
    if (!f.Veggies) score += 4;
    if (f.HvyAlcoholConsump) score += 6;
    score += (f.GenHlth - 1) * 8;
    if (f.Age > 7) score += 10;
    if (f.Age > 10) score += 8;
    score = Math.min(score, 95);
    return { prediction: score > 50 ? 1 : 0, probability: +(score / 100).toFixed(2) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://diabetes-api-gjzd.onrender.com/predict", form, {
        timeout: 4000,
      });
      const data = response.data;
      setResult(data);
      addHistory(data);
    } catch (error) {
      console.error("Server unavailable, using mock prediction:", error);
      const data = mockPredict(form);
      setResult(data);
      addHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const addHistory = (data) => {
    const entry = {
      date: new Date().toISOString(),
      bmi: form.BMI.toFixed(1),
      risk: Math.round((data.probability || data.risk_probability || 0) * 100),
      isHigh: (data.probability || data.risk_probability || 0) > 0.5,
      form: { ...form },
    };
    setHistory((prev) => [entry, ...prev].slice(0, 10));
  };

  const handleDelete = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => setHistory([]);

  return (
    <>
      <form onSubmit={handleSubmit} className="form">

        {/* ──── ข้อมูลส่วนตัว ──── */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">👤</span> ข้อมูลส่วนตัว
          </h3>

          <div className="form-grid">
            <div className="field">
              <label>เพศ</label>
              <select name="Sex" value={form.Sex} onChange={handleChange}>
                <option value={1}>ชาย</option>
                <option value={0}>หญิง</option>
              </select>
            </div>
            <div className="field">
              <label>ช่วงอายุ</label>
              <select name="Age" value={form.Age} onChange={handleChange}>
                <option value={1}>18–24 ปี</option>
                <option value={2}>25–29 ปี</option>
                <option value={3}>30–34 ปี</option>
                <option value={4}>35–39 ปี</option>
                <option value={5}>40–44 ปี</option>
                <option value={6}>45–49 ปี</option>
                <option value={7}>50–54 ปี</option>
                <option value={8}>55–59 ปี</option>
                <option value={9}>60–64 ปี</option>
                <option value={10}>65–69 ปี</option>
                <option value={11}>70–74 ปี</option>
                <option value={12}>75–79 ปี</option>
                <option value={13}>80 ปีขึ้นไป</option>
              </select>
            </div>
          </div>

          {/* น้ำหนัก / ส่วนสูง */}
          <div className="form-grid" style={{ marginTop: "12px" }}>
            <div className="field">
              <label>น้ำหนัก (kg)</label>
              <input
                type="text"
                value={weight}
                onChange={handleWeight}
                placeholder="70"
                inputMode="decimal"
              />
            </div>
            <div className="field">
              <label>ส่วนสูง (cm)</label>
              <input
                type="text"
                value={height}
                onChange={handleHeight}
                placeholder="170"
                inputMode="numeric"
              />
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <BMIBadge bmi={form.BMI} />
          </div>
        </div>

        <hr className="divider" />

        {/* ──── ข้อมูลสุขภาพ ──── */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🩺</span> ข้อมูลสุขภาพ
          </h3>

          <div className="form-grid">
            <div className="field">
              <label>ความดันโลหิตสูง</label>
              <select name="HighBP" value={form.HighBP} onChange={handleChange}>
                <option value={0}>ไม่มี</option>
                <option value={1}>มี</option>
              </select>
            </div>
            <div className="field">
              <label>ดื่มแอลกอฮอล์หนัก</label>
              <select name="HvyAlcoholConsump" value={form.HvyAlcoholConsump} onChange={handleChange}>
                <option value={0}>ไม่ดื่ม</option>
                <option value={1}>ดื่ม</option>
              </select>
            </div>
          </div>

          <div className="field" style={{ marginTop: "12px" }}>
            <label>ประเมินสุขภาพโดยรวมของคุณ</label>
            <select
              name="GenHlth"
              value={form.GenHlth}
              onChange={handleChange}
              className="select-tall"
            >
              <option value={1}>ดีเยี่ยม — ออกกำลังกายสม่ำเสมอ ไม่ค่อยเจ็บป่วย</option>
              <option value={2}>ดีมาก — สุขภาพดี มีอาการป่วยเล็กน้อยเป็นครั้งคราว</option>
              <option value={3}>ดี — สุขภาพโดยรวมปกติ</option>
              <option value={4}>พอใช้ — มีโรคประจำตัวหรือปัญหาสุขภาพบ้าง</option>
              <option value={5}>แย่ — มีอาการเจ็บป่วยหรือข้อจำกัดในการใช้ชีวิตบ่อย</option>
            </select>
          </div>
        </div>

        <hr className="divider" />

        {/* ──── พฤติกรรมและไลฟ์สไตล์ ──── */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🏃</span> พฤติกรรมและไลฟ์สไตล์
          </h3>

          <div className="toggle-section-grid">
            <ToggleGroup
              label="การสูบบุหรี่"
              name="Smoker"
              value={form.Smoker}
              onChange={handleChange}
              options={[
                { value: 0, label: "ไม่สูบ" },
                { value: 1, label: "สูบ" },
              ]}
            />
            <ToggleGroup
              label="ออกกำลังกายเป็นประจำ"
              name="PhysActivity"
              value={form.PhysActivity}
              onChange={handleChange}
              options={[
                { value: 1, label: "ใช่" },
                { value: 0, label: "ไม่ใช่" },
              ]}
            />
            <ToggleGroup
              label="รับประทานผลไม้ทุกวัน"
              name="Fruits"
              value={form.Fruits}
              onChange={handleChange}
              options={[
                { value: 1, label: "ใช่" },
                { value: 0, label: "ไม่ใช่" },
              ]}
            />
            <ToggleGroup
              label="รับประทานผักทุกวัน"
              name="Veggies"
              value={form.Veggies}
              onChange={handleChange}
              options={[
                { value: 1, label: "ใช่" },
                { value: 0, label: "ไม่ใช่" },
              ]}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <span className="spinner" />
              กำลังวิเคราะห์...
            </>
          ) : (
            "วิเคราะห์ความเสี่ยง"
          )}
        </button>
      </form>

      {result && <ResultCard result={result} form={form} />}

      <HistoryTable
        history={history}
        onDelete={handleDelete}
        onView={setViewItem}
        onClearAll={handleClearAll}
      />

      {viewItem && (
        <HistoryModal item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </>
  );
}

/* ──── Toggle group sub-component ──── */
function ToggleGroup({ label, name, value, onChange, options }) {
  return (
    <div className="toggle-group">
      <div className="toggle-label">{label}</div>
      <div className="toggle-buttons">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`toggle-btn ${Number(value) === opt.value ? "active" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={Number(value) === opt.value}
              onChange={onChange}
              style={{ display: "none" }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ──── History modal sub-component ──── */
const AGE_LABELS = ["", "18–24", "25–29", "30–34", "35–39", "40–44", "45–49",
  "50–54", "55–59", "60–64", "65–69", "70–74", "75–79", "80+"];

function HistoryModal({ item, onClose }) {
  const f = item.form;
  const rows = [
    ["ความเสี่ยง", `${item.risk}% — ${item.isHigh ? "สูง" : "ต่ำ"}`],
    ["BMI", item.bmi],
    ["อายุ", `${AGE_LABELS[f.Age]} ปี`],
    ["เพศ", f.Sex ? "ชาย" : "หญิง"],
    ["ความดันโลหิต", f.HighBP ? "มีความดันสูง" : "ปกติ"],
    ["สูบบุหรี่", f.Smoker ? "ใช่" : "ไม่"],
    ["ออกกำลังกาย", f.PhysActivity ? "สม่ำเสมอ" : "ไม่"],
    ["รับประทานผลไม้", f.Fruits ? "ใช่" : "ไม่"],
    ["รับประทานผัก", f.Veggies ? "ใช่" : "ไม่"],
    ["แอลกอฮอล์หนัก", f.HvyAlcoholConsump ? "ใช่" : "ไม่"],
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>ผลการประเมิน</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-date">
            {new Date(item.date).toLocaleString("th-TH", {
              dateStyle: "long", timeStyle: "short",
            })}
          </div>
          {rows.map(([k, v]) => (
            <div className="modal-row" key={k}>
              <span className="modal-key">{k}</span>
              <span className="modal-val">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiabetesForm;