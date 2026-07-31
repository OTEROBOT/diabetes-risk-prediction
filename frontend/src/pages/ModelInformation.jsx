// frontend/src/pages/ModelInformation.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ConfusionMatrix from "../components/ConfusionMatrix";

function ModelInformation() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModel = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/model_information");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "No model found");
          setModel(null);
          return;
        }

        setModel(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load model information");
        setModel(null);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const toPercent = (value) => {
    if (value === null || value === undefined || isNaN(Number(value))) return "0.00";
    return (Number(value) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">Loading Model Information...</p>
        </div>
      </Layout>
    );
  }

  if (!model) {
    return (
      <Layout>
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            No Model Found
          </h2>
          <p className="text-gray-500">
            {error || "Please train and activate a model first."}
          </p>
        </div>
      </Layout>
    );
  }

  const metrics = [
    { label: "Accuracy", value: toPercent(model.accuracy), color: "text-blue-600" },
    { label: "Precision", value: toPercent(model.precision), color: "text-green-600" },
    { label: "Recall", value: toPercent(model.recall), color: "text-orange-600" },
    { label: "F1 Score", value: toPercent(model.f1), color: "text-purple-600" },
    { label: "AUC", value: toPercent(model.auc), color: "text-red-600" },
    { label: "Cross Validation", value: toPercent(model.cv_accuracy), color: "text-cyan-600" },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Model Information</h1>
        <p className="text-gray-500 mt-2">
          Detailed performance of the current active AI model.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="uppercase tracking-widest text-sm opacity-90">
              Active Model
            </p>
            <h2 className="text-4xl font-bold mt-2">
              {model.model_name || "-"}
            </h2>
            <p className="mt-2 opacity-90">
              Algorithm: {model.algorithm || model.model_name || "-"}
            </p>
          </div>

          <div className="bg-white/20 rounded-xl px-5 py-3 backdrop-blur">
            <p className="text-sm opacity-90">Status</p>
            <p className="text-xl font-bold">
              {model.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <h2 className={`text-3xl font-bold mt-2 ${item.color}`}>
              {item.value}%
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-5">
            Model Details
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Model ID</span>
              <span className="font-semibold">#{model.id}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Model Name</span>
              <span className="font-semibold">{model.model_name || "-"}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Algorithm</span>
              <span className="font-semibold">
                {model.algorithm || model.model_name || "-"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-semibold ${
                  model.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {model.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Created At</span>
              <span className="font-semibold">
                {model.created_at
                  ? new Date(String(model.created_at).replace(" ", "T")).toLocaleString(
                      "th-TH"
                    )
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        <ConfusionMatrix matrix={model.confusion_matrix} />
      </div>
    </Layout>
  );
}

export default ModelInformation;