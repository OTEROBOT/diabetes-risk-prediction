import { useState, useEffect } from "react";
import Layout from "../components/Layout";

function Train() {
  const [algorithm, setAlgorithm] = useState("Random Forest");
  const [trainRatio, setTrainRatio] = useState(80);
  const [kFold, setKFold] = useState(5);
  const [smote, setSmote] = useState(true);
  const [dataset, setDataset] = useState("");
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/datasets")
      .then((res) => res.json())
      .then((data) => {
        setDatasets(data);
        if (data.length > 0) {
          setDataset(data[0].filename);
        }
      })
      .catch((err) => console.error("Error fetching datasets:", err));
  }, []);

  const trainModel = async () => {

    if (!dataset) {
      alert("Please select dataset");
      return;
    }

    setLoading(true);

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

    } finally {

        setLoading(false);

    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Train Model</h1>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* แก้ไขส่วน Dataset Dropdown ให้ถูกต้อง */}
        <div>
          <label className="font-semibold block mb-2">Select Dataset</label>
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="w-full border rounded p-3"
          >
            {datasets.length === 0 ? (
              <option value="">No datasets available</option>
            ) : (
              datasets.map((item, index) => (
                <option key={item.id || index} value={item.filename}>
                  {item.filename}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-2">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full border rounded p-3"
          >
            <option>Random Forest</option>
            <option>Logistic Regression</option>
            <option>Decision Tree</option>
            <option>KNN</option>
            <option>SVM</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-2">Train/Test Split</label>
          <select
            value={trainRatio}
            onChange={(e) => setTrainRatio(Number(e.target.value))}
            className="w-full border rounded p-3"
          >
            <option value={70}>70 / 30</option>
            <option value={75}>75 / 25</option>
            <option value={80}>80 / 20</option>
            <option value={90}>90 / 10</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-2">K-Fold Cross Validation</label>
          <select
            value={kFold}
            onChange={(e) => setKFold(Number(e.target.value))}
            className="w-full border rounded p-3"
          >
            <option value={3}>3 Fold</option>
            <option value={5}>5 Fold</option>
            <option value={10}>10 Fold</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="smote"
            checked={smote}
            onChange={(e) => setSmote(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="smote" className="cursor-pointer">Enable SMOTE</label>
        </div>

        <button
          onClick={trainModel}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "Training..." : "Train Model"}
        </button>
      </div>
    </Layout>
  );
}

export default Train;