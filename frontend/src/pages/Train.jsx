import { useState } from "react";
import Layout from "../components/Layout";

function Train() {
  const [algorithm, setAlgorithm] = useState("Random Forest");
  const [trainRatio, setTrainRatio] = useState(80);
  const [kFold, setKFold] = useState(5);
  const [smote, setSmote] = useState(true);
  const [dataset, setDataset] = useState("");

  const trainModel = async () => {
    if (!dataset) {
      alert("Please select dataset");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/train_model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset: dataset,
          algorithm: algorithm,
          split: trainRatio / 100,
          smote: smote,
          kfold: kFold,
        }),
      });

      const result = await response.json();
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Error training model:", error);
      alert("Failed to connect to backend server");
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Train Model</h1>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* ย้ายส่วน Dataset เข้ามาไว้ใน return */}
        <div>
          <label className="font-semibold">Dataset</label>
          <input
            type="text"
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            placeholder="diabetes_binary_5050split_health_indicators_BRFSS2015.csv"
            className="w-full border rounded p-3 mt-2"
          />
        </div>

        <div>
          <label className="font-semibold">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full border rounded p-3 mt-2"
          >
            <option>Random Forest</option>
            <option>Logistic Regression</option>
            <option>Decision Tree</option>
            <option>KNN</option>
            <option>SVM</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Train/Test Split</label>
          <select
            value={trainRatio}
            onChange={(e) => setTrainRatio(Number(e.target.value))}
            className="w-full border rounded p-3 mt-2"
          >
            <option value={70}>70 / 30</option>
            <option value={75}>75 / 25</option>
            <option value={80}>80 / 20</option>
            <option value={90}>90 / 10</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">K-Fold Cross Validation</label>
          <select
            value={kFold}
            onChange={(e) => setKFold(Number(e.target.value))}
            className="w-full border rounded p-3 mt-2"
          >
            <option value={3}>3 Fold</option>
            <option value={5}>5 Fold</option>
            <option value={10}>10 Fold</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={smote}
            onChange={(e) => setSmote(e.target.checked)}
          />
          <label>Enable SMOTE</label>
        </div>

        {/* แก้ไขแท็ก button ให้ถูกต้อง */}
        <button
          onClick={trainModel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
        >
          Train Model
        </button>
      </div>
    </Layout>
  );
}

export default Train;