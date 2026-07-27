// frontend/src/pages/Predict.jsx

import { useState } from "react";
import Layout from "../components/Layout"; // ปรับ path ตามโปรเจกต์ของคุณ

function Predict() {
  const defaultForm = {
    HighBP: 0,
    BMI: "25",
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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
          BMI: Number(form.BMI) || 0,
        }),
      });

      const data = await res.json();

      // เพิ่มข้อมูลเวลาและ ID (จำลอง)
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
        predictionId: `#${Math.floor(Math.random() * 900) + 100}`, // สุ่ม ID จำลอง
      });
    } catch (err) {
      console.error(err);
      alert("Prediction Failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setResult(null);
  };

  // ฟังก์ชันช่วยแปลงค่าเป็นข้อความอ่านง่าย
  const getLabel = (key, value) => {
    const maps = {
      Sex: { 1: "Male", 0: "Female" },
      Age: {
        1: "18-24 Years", 2: "25-29 Years", 3: "30-34 Years", 4: "35-39 Years",
        5: "40-44 Years", 6: "45-49 Years", 7: "50-54 Years", 8: "55-59 Years",
        9: "60-64 Years", 10: "65-69 Years", 11: "70-74 Years", 12: "75-79 Years", 13: "80+ Years",
      },
      Smoker: { 0: "No", 1: "Yes" },
      PhysActivity: { 1: "Yes", 0: "No" },
      Fruits: { 1: "Yes", 0: "No" },
      Veggies: { 1: "Yes", 0: "No" },
      HvyAlcoholConsump: { 0: "No", 1: "Yes" },
      HighBP: { 0: "No", 1: "Yes" },
      GenHlth: {
        1: "Excellent", 2: "Very Good", 3: "Good", 4: "Fair", 5: "Poor",
      },
    };
    return maps[key]?.[value] ?? value;
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-slate-800">
        Diabetes Prediction
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10">

        {/* ===================== Patient Information ===================== */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-700">
            👤 Patient Information
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sex */}
            <div>
              <label className="block font-semibold mb-1">Sex</label>
              <p className="text-sm text-gray-500 mb-2">เพศของผู้ป่วย</p>
              <select
                name="Sex"
                value={form.Sex}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block font-semibold mb-1">Age Group</label>
              <p className="text-sm text-gray-500 mb-2">Choose your age range</p>
              <select
                name="Age"
                value={form.Age}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>18-24 Years</option>
                <option value={2}>25-29 Years</option>
                <option value={3}>30-34 Years</option>
                <option value={4}>35-39 Years</option>
                <option value={5}>40-44 Years</option>
                <option value={6}>45-49 Years</option>
                <option value={7}>50-54 Years</option>
                <option value={8}>55-59 Years</option>
                <option value={9}>60-64 Years</option>
                <option value={10}>65-69 Years</option>
                <option value={11}>70-74 Years</option>
                <option value={12}>75-79 Years</option>
                <option value={13}>80+ Years</option>
              </select>
            </div>

            {/* BMI */}
            <div>
              <label className="block font-semibold mb-1">BMI</label>
              <p className="text-sm text-gray-500 mb-2">Body Mass Index</p>
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
            </div>
          </div>
        </div>

        {/* ===================== Health Behavior ===================== */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-green-700">
            🍎 Health Behavior
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Smoker */}
            <div>
              <label className="block font-semibold mb-1">Smoker</label>
              <p className="text-sm text-gray-500 mb-2">เคยสูบบุหรี่หรือไม่</p>
              <select
                name="Smoker"
                value={form.Smoker}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            {/* Physical Activity */}
            <div>
              <label className="block font-semibold mb-1">Physical Activity</label>
              <p className="text-sm text-gray-500 mb-2">ออกกำลังกายเป็นประจำ</p>
              <select
                name="PhysActivity"
                value={form.PhysActivity}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            {/* Fruits */}
            <div>
              <label className="block font-semibold mb-1">Fruit</label>
              <p className="text-sm text-gray-500 mb-2">กินผลไม้เป็นประจำ</p>
              <select
                name="Fruits"
                value={form.Fruits}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            {/* Vegetables */}
            <div>
              <label className="block font-semibold mb-1">Vegetable</label>
              <p className="text-sm text-gray-500 mb-2">กินผักเป็นประจำ</p>
              <select
                name="Veggies"
                value={form.Veggies}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            {/* Alcohol */}
            <div>
              <label className="block font-semibold mb-1">Alcohol</label>
              <p className="text-sm text-gray-500 mb-2">ดื่มแอลกอฮอล์หนัก</p>
              <select
                name="HvyAlcoholConsump"
                value={form.HvyAlcoholConsump}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================== Medical History ===================== */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-red-700">
            ❤️ Medical History
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* High Blood Pressure */}
            <div>
              <label className="block font-semibold mb-1">High Blood Pressure</label>
              <p className="text-sm text-gray-500 mb-2">มีความดันโลหิตสูงหรือไม่</p>
              <select
                name="HighBP"
                value={form.HighBP}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            {/* General Health */}
            <div>
              <label className="block font-semibold mb-1">General Health</label>
              <p className="text-sm text-gray-500 mb-2">
                1 = Excellent &nbsp;|&nbsp; 5 = Poor
              </p>
              <select
                name="GenHlth"
                value={form.GenHlth}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value={1}>1 - Excellent</option>
                <option value={2}>2 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Fair</option>
                <option value={5}>5 - Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================== Buttons ===================== */}
        <div className="space-y-4">
          <button
            onClick={predict}
            disabled={loading}
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
              <>🩺 Predict Diabetes Risk</>
            )}
          </button>

          <button
            onClick={resetForm}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
          >
            🔄 Reset Form
          </button>
        </div>

        {/* ===================== Result Section ===================== */}
        {result && (
          <div className="mt-10 space-y-8">

            {/* Patient Summary */}
            <div className="bg-slate-50 border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5 text-slate-700">
                📋 Patient Summary
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Sex</p>
                  <p className="font-semibold text-lg">{getLabel("Sex", form.Sex)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-semibold text-lg">{getLabel("Age", form.Age)}</p>
                </div>
                <div>
                  <p className="text-gray-500">BMI</p>
                  <p className="font-semibold text-lg">{form.BMI}</p>
                </div>
                <div>
                  <p className="text-gray-500">General Health</p>
                  <p className="font-semibold text-lg">{getLabel("GenHlth", form.GenHlth)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Smoker</p>
                  <p className="font-semibold text-lg">{getLabel("Smoker", form.Smoker)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Physical Activity</p>
                  <p className="font-semibold text-lg">{getLabel("PhysActivity", form.PhysActivity)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fruit</p>
                  <p className="font-semibold text-lg">{getLabel("Fruits", form.Fruits)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vegetable</p>
                  <p className="font-semibold text-lg">{getLabel("Veggies", form.Veggies)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Alcohol</p>
                  <p className="font-semibold text-lg">{getLabel("HvyAlcoholConsump", form.HvyAlcoholConsump)}</p>
                </div>
                <div>
                  <p className="text-gray-500">High Blood Pressure</p>
                  <p className="font-semibold text-lg">{getLabel("HighBP", form.HighBP)}</p>
                </div>
              </div>
            </div>

            {/* Prediction Result */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold mb-6 text-center">
                🧠 Prediction Result
              </h2>

              {/* Prediction Meta */}
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">Prediction ID:</span>{" "}
                  <span className="font-bold text-blue-600">{result.predictionId}</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">Prediction Time:</span>{" "}
                  <span className="font-bold">{result.predictionTime}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-100 rounded-xl p-5">
                  <p className="text-gray-500">Current Model</p>
                  <h3 className="text-2xl font-bold">{result.model}</h3>
                </div>

                <div
                  className={`rounded-xl p-5 text-white ${
                    result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  <p>Risk Level</p>
                  <h3 className="text-3xl font-bold">
                    {result.prediction === 1
                      ? "🔴 High Risk"
                      : "🟢 Low Risk"}
                  </h3>
                </div>

                <div className="bg-cyan-100 rounded-xl p-5">
                  <p className="text-cyan-900 font-medium">Probability</p>
                  <h3 className="text-4xl font-bold text-cyan-700">
                    {((result?.probability ?? 0) * 100).toFixed(2)}%
                  </h3>
                </div>

                <div className="bg-orange-100 rounded-xl p-5">
                  <p className="text-orange-900 font-medium">Risk Score</p>
                  <h3 className="text-4xl font-bold text-orange-700">
                    {result.risk}%
                  </h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Diabetes Risk</span>
                  <span className="font-bold">{result.risk}%</span>
                </div>
                <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${result.risk}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-8 rounded-xl p-5 bg-gray-100">
                <h3 className="font-bold text-xl mb-3">Recommendation</h3>
                {result.prediction === 1 ? (
                  <>
                    <ul className="list-disc ml-6 space-y-2 mb-4">
                      <li>Consult your doctor for further examination.</li>
                      <li>Reduce sugar intake.</li>
                      <li>Exercise at least 30 minutes daily.</li>
                      <li>Maintain a healthy body weight.</li>
                    </ul>
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                      ⚠ This prediction is for screening only.<br />
                      Please consult a physician.
                    </div>
                  </>
                ) : (
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Keep exercising regularly.</li>
                    <li>Continue eating healthy foods.</li>
                    <li>Have a health check every year.</li>
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