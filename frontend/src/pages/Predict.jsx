import { useState } from "react";
import Layout from "../components/Layout";

// ไฟล์ Predict.jsx
function Predict() {
  const [form, setForm] = useState({
    HighBP: 0,
    BMI: 25,
    Smoker: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    HvyAlcoholConsump: 0,
    GenHlth: 3,
    Sex: 1,
    Age: 9,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const predict = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          BMI: Number(form.BMI) || 0, // แปลง BMI จาก string ให้เป็น number ก่อนส่งไป backend
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Prediction Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Diabetes Prediction</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        {/* High Blood Pressure */}
        <div>
          <label className="font-medium">High Blood Pressure</label>
          <select
            name="HighBP"
            value={form.HighBP}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        {/* BMI */}
        <div>
          <label className="font-medium">BMI</label>
          <input
            type="text"
            name="BMI"
            value={form.BMI}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[0-9.]+$/.test(value)) {
                setForm({
                  ...form,
                  BMI: value,
                });
              }
            }}
            className="border w-full p-2 rounded mt-1"
          />
        </div>

        {/* Smoker */}
        <div>
          <label className="font-medium">Smoker</label>
          <select
            name="Smoker"
            value={form.Smoker}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        {/* Physical Activity */}
        <div>
          <label className="font-medium">Physical Activity</label>
          <select
            name="PhysActivity"
            value={form.PhysActivity}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        {/* Fruits */}
        <div>
          <label className="font-medium">Fruits</label>
          <select
            name="Fruits"
            value={form.Fruits}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        {/* Vegetables */}
        <div>
          <label className="font-medium">Vegetables</label>
          <select
            name="Veggies"
            value={form.Veggies}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        {/* Heavy Alcohol */}
        <div>
          <label className="font-medium">Heavy Alcohol</label>
          <select
            name="HvyAlcoholConsump"
            value={form.HvyAlcoholConsump}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        {/* General Health */}
        <div>
          <label className="font-medium">General Health (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            name="GenHlth"
            value={form.GenHlth}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="font-medium">Sex</label>
          <select
            name="Sex"
            value={form.Sex}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          >
            <option value={1}>Male</option>
            <option value={0}>Female</option>
          </select>
        </div>

        {/* Age Group */}
        <div>
          <label className="font-medium">Age Group</label>
          <select
            name="Age"
            value={form.Age}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
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

        {/* Predict Button */}
        <button
          onClick={predict}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition w-full md:w-auto"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white mt-8 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🧠 Prediction Result
          </h2>

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
                {result.prediction === 1 ? "🔴 High Risk" : "🟢 Low Risk"}
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
                style={{
                  width: `${result.risk}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 rounded-xl p-5 bg-gray-100">
            <h3 className="font-bold text-xl mb-3">Recommendation</h3>
            {result.prediction === 1 ? (
              <ul className="list-disc ml-6 space-y-2">
                <li>Consult your doctor for further examination.</li>
                <li>Reduce sugar intake.</li>
                <li>Exercise at least 30 minutes daily.</li>
                <li>Maintain a healthy body weight.</li>
              </ul>
            ) : (
              <ul className="list-disc ml-6 space-y-2">
                <li>Keep exercising regularly.</li>
                <li>Continue eating healthy foods.</li>
                <li>Have a health check every year.</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Predict;