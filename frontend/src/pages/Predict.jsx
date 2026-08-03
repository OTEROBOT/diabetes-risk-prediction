// frontend/src/pages/Predict.jsx

import { useMemo, useState } from "react";
import Layout from "../components/Layout";

function Predict() {
  const defaultForm = {
    HighBP: 0,
    BMI: "25.0",
    Smoker: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    HvyAlcoholConsump: 0,
    GenHlth: 3,
    Sex: 1,
    Age: 9,
  };

  const [form, setForm] = useState(defaultForm);
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("72");
  const [useAutoBMI, setUseAutoBMI] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const autoBMI = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return Number((w / Math.pow(h / 100, 2)).toFixed(1));
  }, [height, weight]);

  const currentBMI =
    useAutoBMI && autoBMI != null ? autoBMI : Number(form.BMI) || 0;

  const getBMICategory = (bmi) => {
    if (!bmi || bmi <= 0) return { label: "-", color: "text-gray-500" };
    if (bmi < 18.5)
      return { label: "น้ำหนักน้อย / Underweight", color: "text-yellow-600" };
    if (bmi < 25)
      return { label: "ปกติ / Normal", color: "text-green-600" };
    if (bmi < 30)
      return { label: "น้ำหนักเกิน / Overweight", color: "text-orange-600" };
    return { label: "อ้วน / Obese", color: "text-red-600" };
  };

  const bmiInfo = getBMICategory(currentBMI);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "BMI" ? value : Number(value),
    });
  };

  const predict = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          BMI: currentBMI || 0,
        }),
      });

      const data = await res.json();
      const now = new Date();
      const predictionTime = now.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setResult({
        ...data,
        predictionTime,
        predictionId: data?.id
          ? `#${data.id}`
          : `#${Math.floor(Math.random() * 900) + 100}`,
        usedBMI: currentBMI,
      });
    } catch (err) {
      console.error(err);
      alert("Prediction Failed / การทำนายล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setHeight("170");
    setWeight("72");
    setUseAutoBMI(true);
    setResult(null);
  };

  const getLabel = (key, value) => {
    const maps = {
      Sex: { 1: "ชาย / Male", 0: "หญิง / Female" },
      Age: {
        1: "18-24 ปี",
        2: "25-29 ปี",
        3: "30-34 ปี",
        4: "35-39 ปี",
        5: "40-44 ปี",
        6: "45-49 ปี",
        7: "50-54 ปี",
        8: "55-59 ปี",
        9: "60-64 ปี",
        10: "65-69 ปี",
        11: "70-74 ปี",
        12: "75-79 ปี",
        13: "80 ปีขึ้นไป",
      },
      Smoker: { 0: "ไม่สูบ / No", 1: "สูบ / Yes" },
      PhysActivity: { 1: "มี / Yes", 0: "ไม่มี / No" },
      Fruits: { 1: "กินเป็นประจำ / Yes", 0: "ไม่ค่อยกิน / No" },
      Veggies: { 1: "กินเป็นประจำ / Yes", 0: "ไม่ค่อยกิน / No" },
      HvyAlcoholConsump: { 0: "ไม่ดื่มหนัก / No", 1: "ดื่มหนัก / Yes" },
      HighBP: { 0: "ไม่มี / No", 1: "มี / Yes" },
      GenHlth: {
        1: "ดีมาก / Excellent",
        2: "ค่อนข้างดี / Very Good",
        3: "ปานกลาง / Good",
        4: "ค่อนข้างแย่ / Fair",
        5: "ไม่ดี / Poor",
      },
    };
    return maps[key]?.[value] ?? value;
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-2 text-slate-800">
        ประเมินความเสี่ยงโรคเบาหวาน
      </h1>
      <p className="text-gray-500 mb-8">
        Diabetes Risk Prediction — กรอกข้อมูลสุขภาพเพื่อประเมินความเสี่ยงเบื้องต้น
      </p>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10">
        {/* Patient Information */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-700">
            👤 ข้อมูลส่วนบุคคล / Patient Information
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">เพศ / Sex</label>
              <p className="text-sm text-gray-500 mb-2">
                เลือกเพศตามสภาพร่างกายจริง
              </p>
              <select
                name="Sex"
                value={form.Sex}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>ชาย / Male</option>
                <option value={0}>หญิง / Female</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                กลุ่มอายุ / Age Group
              </label>
              <p className="text-sm text-gray-500 mb-2">
                เลือกช่วงอายุปัจจุบันของคุณ
              </p>
              <select
                name="Age"
                value={form.Age}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>18-24 ปี</option>
                <option value={2}>25-29 ปี</option>
                <option value={3}>30-34 ปี</option>
                <option value={4}>35-39 ปี</option>
                <option value={5}>40-44 ปี</option>
                <option value={6}>45-49 ปี</option>
                <option value={7}>50-54 ปี</option>
                <option value={8}>55-59 ปี</option>
                <option value={9}>60-64 ปี</option>
                <option value={10}>65-69 ปี</option>
                <option value={11}>70-74 ปี</option>
                <option value={12}>75-79 ปี</option>
                <option value={13}>80 ปีขึ้นไป</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                ส่วนสูง / Height (cm)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                กรอกส่วนสูงเป็นเซนติเมตร เช่น 170
              </p>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="100"
                max="250"
                step="0.1"
                className="w-full border rounded-lg p-3"
                placeholder="เช่น 170"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                น้ำหนัก / Weight (kg)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                กรอกน้ำหนักเป็นกิโลกรัม เช่น 72
              </p>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="20"
                max="300"
                step="0.1"
                className="w-full border rounded-lg p-3"
                placeholder="เช่น 72"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div>
                  <label className="block font-semibold mb-1">
                    ดัชนีมวลกาย / BMI
                  </label>
                  <p className="text-sm text-gray-500">
                    คำนวณอัตโนมัติจากส่วนสูงและน้ำหนัก
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={useAutoBMI}
                    onChange={(e) => setUseAutoBMI(e.target.checked)}
                  />
                  ใช้ค่า BMI อัตโนมัติ
                </label>
              </div>

              {useAutoBMI ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700">BMI ที่คำนวณได้</p>
                    <p className="text-3xl font-bold text-blue-700 mt-1">
                      {autoBMI ?? "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-xl p-4">
                    <p className="text-sm text-gray-500">หมวดหมู่</p>
                    <p className={`text-xl font-bold mt-1 ${bmiInfo.color}`}>
                      {bmiInfo.label}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">
                    <p className="font-semibold mb-1">สูตรการคำนวณ</p>
                    <p>BMI = น้ำหนัก / (ส่วนสูงเมตร)²</p>
                    <p className="mt-2">
                      ตัวอย่าง: 72 ÷ (1.70)² = {autoBMI ?? "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  name="BMI"
                  value={form.BMI}
                  onChange={handleChange}
                  step="0.1"
                  min="10"
                  max="60"
                  className="w-full border rounded-lg p-3"
                  placeholder="เช่น 25.5"
                />
              )}
            </div>
          </div>
        </div>

        {/* Health Behavior */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-green-700">
            🍎 พฤติกรรมสุขภาพ / Health Behavior
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">
                การสูบบุหรี่ / Smoker
              </label>
              <p className="text-sm text-gray-500 mb-2">
                เคยสูบบุหรี่อย่างน้อย 100 มวนในช่วงชีวิตหรือไม่
              </p>
              <select
                name="Smoker"
                value={form.Smoker}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={0}>ไม่สูบ / No</option>
                <option value={1}>สูบหรือเคยสูบ / Yes</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                การออกกำลังกาย / Physical Activity
              </label>
              <p className="text-sm text-gray-500 mb-2">
                ในช่วง 30 วันที่ผ่านมา ได้ออกกำลังกายหรือทำกิจกรรมทางกายหรือไม่
                (ไม่นับงานบ้านทั่วไป)
              </p>
              <select
                name="PhysActivity"
                value={form.PhysActivity}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>มี / Yes</option>
                <option value={0}>ไม่มี / No</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                การกินผลไม้ / Fruit
              </label>
              <p className="text-sm text-gray-500 mb-2">
                กินผลไม้เป็นประจำหรือไม่ เช่น วันละ 1 ครั้งขึ้นไป
              </p>
              <select
                name="Fruits"
                value={form.Fruits}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>กินเป็นประจำ / Yes</option>
                <option value={0}>ไม่ค่อยกิน / No</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                การกินผัก / Vegetable
              </label>
              <p className="text-sm text-gray-500 mb-2">
                กินผักเป็นประจำหรือไม่ เช่น วันละ 1 ครั้งขึ้นไป
              </p>
              <select
                name="Veggies"
                value={form.Veggies}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>กินเป็นประจำ / Yes</option>
                <option value={0}>ไม่ค่อยกิน / No</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                การดื่มแอลกอฮอล์หนัก / Heavy Alcohol
              </label>
              <p className="text-sm text-gray-500 mb-2">
                ชาย: ดื่ม 14 แก้วขึ้นไป/สัปดาห์ | หญิง: ดื่ม 7 แก้วขึ้นไป/สัปดาห์
              </p>
              <select
                name="HvyAlcoholConsump"
                value={form.HvyAlcoholConsump}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={0}>ไม่ดื่มหนัก / No</option>
                <option value={1}>ดื่มหนัก / Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-red-700">
            ❤️ ประวัติสุขภาพ / Medical History
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">
                ความดันโลหิตสูง / High Blood Pressure
              </label>
              <p className="text-sm text-gray-500 mb-2">
                เคยได้รับการวินิจฉัยว่ามีความดันโลหิตสูง หรือกำลังใช้ยาลดความดันอยู่หรือไม่
              </p>
              <select
                name="HighBP"
                value={form.HighBP}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={0}>ไม่มี / No</option>
                <option value={1}>มี หรือกำลังรักษา / Yes</option>
              </select>

              <div className="mt-3 text-xs text-gray-600 bg-gray-50 border rounded-lg p-3 leading-relaxed">
                <p className="font-semibold mb-1">คำอธิบาย</p>
                <p>
                  เลือก “มี” หากเคยตรวจพบความดันโลหิตสูง
                  เช่น ความดันตัวบนตั้งแต่ 140 ขึ้นไปเป็นประจำ
                  หรือแพทย์เคยแจ้งว่าเป็นโรคความดันโลหิตสูง
                </p>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                สุขภาพโดยรวม / General Health
              </label>
              <p className="text-sm text-gray-500 mb-2">
                ประเมินสุขภาพโดยรวมของตนเองในช่วงนี้
              </p>
              <select
                name="GenHlth"
                value={form.GenHlth}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>1 - ดีมาก / Excellent</option>
                <option value={2}>2 - ค่อนข้างดี / Very Good</option>
                <option value={3}>3 - ปานกลาง / Good</option>
                <option value={4}>4 - ค่อนข้างแย่ / Fair</option>
                <option value={5}>5 - ไม่ดี / Poor</option>
              </select>

              <div className="mt-3 text-xs text-gray-600 bg-gray-50 border rounded-lg p-3 leading-relaxed space-y-1">
                <p className="font-semibold mb-1">วิธีเลือกระดับสุขภาพ</p>
                <p>
                  <span className="font-semibold">1 ดีมาก:</span> แข็งแรงมาก
                  แทบไม่ป่วย ใช้ชีวิตได้เต็มที่
                </p>
                <p>
                  <span className="font-semibold">2 ค่อนข้างดี:</span> สุขภาพดี
                  อาจมีอาการเล็กน้อยบางครั้ง
                </p>
                <p>
                  <span className="font-semibold">3 ปานกลาง:</span> พอใช้
                  มีเหนื่อยหรือไม่สบายบ้าง
                </p>
                <p>
                  <span className="font-semibold">4 ค่อนข้างแย่:</span>{" "}
                  ป่วยบ่อยหรือเหนื่อยง่าย
                </p>
                <p>
                  <span className="font-semibold">5 ไม่ดี:</span> มีปัญหาสุขภาพชัดเจน
                  กระทบชีวิตประจำวัน
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={predict}
            disabled={loading || !currentBMI}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                กำลังวิเคราะห์...
              </>
            ) : (
              <>🩺 ประเมินความเสี่ยงโรคเบาหวาน</>
            )}
          </button>

          <button
            onClick={resetForm}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
          >
            🔄 รีเซ็ตฟอร์ม / Reset Form
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-10 space-y-8">
            <div className="bg-slate-50 border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5 text-slate-700">
                📋 สรุปข้อมูลผู้ประเมิน / Patient Summary
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">เพศ</p>
                  <p className="font-semibold text-lg">
                    {getLabel("Sex", form.Sex)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">อายุ</p>
                  <p className="font-semibold text-lg">
                    {getLabel("Age", form.Age)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ส่วนสูง</p>
                  <p className="font-semibold text-lg">{height} cm</p>
                </div>
                <div>
                  <p className="text-gray-500">น้ำหนัก</p>
                  <p className="font-semibold text-lg">{weight} kg</p>
                </div>
                <div>
                  <p className="text-gray-500">BMI</p>
                  <p className="font-semibold text-lg">
                    {result.usedBMI ?? currentBMI} ({bmiInfo.label})
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">สุขภาพโดยรวม</p>
                  <p className="font-semibold text-lg">
                    {getLabel("GenHlth", form.GenHlth)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">สูบบุหรี่</p>
                  <p className="font-semibold text-lg">
                    {getLabel("Smoker", form.Smoker)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ออกกำลังกาย</p>
                  <p className="font-semibold text-lg">
                    {getLabel("PhysActivity", form.PhysActivity)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ผลไม้</p>
                  <p className="font-semibold text-lg">
                    {getLabel("Fruits", form.Fruits)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ผัก</p>
                  <p className="font-semibold text-lg">
                    {getLabel("Veggies", form.Veggies)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">แอลกอฮอล์</p>
                  <p className="font-semibold text-lg">
                    {getLabel("HvyAlcoholConsump", form.HvyAlcoholConsump)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ความดันโลหิตสูง</p>
                  <p className="font-semibold text-lg">
                    {getLabel("HighBP", form.HighBP)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold mb-6 text-center">
                🧠 ผลการประเมินความเสี่ยง
              </h2>

              <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">รหัสผลลัพธ์:</span>{" "}
                  <span className="font-bold text-blue-600">
                    {result.predictionId}
                  </span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">เวลาประเมิน:</span>{" "}
                  <span className="font-bold">{result.predictionTime}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-100 rounded-xl p-5">
                  <p className="text-gray-500">โมเดลที่ใช้</p>
                  <h3 className="text-2xl font-bold">{result.model || "-"}</h3>
                </div>

                <div
                  className={`rounded-xl p-5 text-white ${
                    result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  <p>ระดับความเสี่ยง</p>
                  <h3 className="text-3xl font-bold">
                    {result.prediction === 1
                      ? "🔴 ความเสี่ยงสูง"
                      : "🟢 ความเสี่ยงต่ำ"}
                  </h3>
                </div>

                <div className="bg-cyan-100 rounded-xl p-5">
                  <p className="text-cyan-900 font-medium">
                    ความน่าจะเป็น / Probability
                  </p>
                  <h3 className="text-4xl font-bold text-cyan-700">
                    {result?.probability != null
                      ? `${(
                          Number(result.probability) <= 1
                            ? Number(result.probability) * 100
                            : Number(result.probability)
                        ).toFixed(2)}%`
                      : `${Number(result.risk || 0).toFixed(2)}%`}
                  </h3>
                </div>

                <div className="bg-orange-100 rounded-xl p-5">
                  <p className="text-orange-900 font-medium">คะแนนความเสี่ยง</p>
                  <h3 className="text-4xl font-bold text-orange-700">
                    {Number(result.risk || 0).toFixed(2)}%
                  </h3>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">ระดับความเสี่ยงโรคเบาหวาน</span>
                  <span className="font-bold">
                    {Number(result.risk || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(Number(result.risk || 0), 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mt-8 rounded-xl p-5 bg-gray-100">
                <h3 className="font-bold text-xl mb-3">
                  คำแนะนำด้านสุขภาพ / Recommendation
                </h3>

                {result.prediction === 1 ? (
                  <>
                    <ul className="list-disc ml-6 space-y-2 mb-4">
                      <li>ควรพบแพทย์เพื่อตรวจเพิ่มเติม</li>
                      <li>ลดการบริโภคน้ำตาลและอาหารแปรรูป</li>
                      <li>ออกกำลังกายอย่างน้อยวันละ 30 นาที</li>
                      <li>ควบคุมน้ำหนักให้อยู่ในเกณฑ์ที่เหมาะสม</li>
                      <li>ตรวจระดับน้ำตาลในเลือดเป็นระยะ</li>
                    </ul>
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                      ⚠ ผลการประเมินนี้ใช้เพื่อคัดกรองเบื้องต้นเท่านั้น
                      <br />
                      ไม่ใช่การวินิจฉัยโรค กรุณาปรึกษาแพทย์เพื่อการตรวจที่ถูกต้อง
                    </div>
                  </>
                ) : (
                  <ul className="list-disc ml-6 space-y-2">
                    <li>ออกกำลังกายอย่างสม่ำเสมอ</li>
                    <li>รับประทานอาหารที่มีประโยชน์ต่อเนื่อง</li>
                    <li>ตรวจสุขภาพประจำปีอย่างน้อยปีละ 1 ครั้ง</li>
                    <li>รักษาน้ำหนักให้อยู่ในเกณฑ์ปกติ</li>
                    <li>หลีกเลี่ยงการสูบบุหรี่และการดื่มแอลกอฮอล์หนัก</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Predict;