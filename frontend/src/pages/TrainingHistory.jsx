// frontend/src/pages/TrainingHistory.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function TrainingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/training_history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Load Training History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // ===== Summary Calculations =====
  const totalTraining = history.length;

  const bestAccuracy =
    history.length > 0
      ? Math.max(...history.map((item) => item.accuracy ?? 0))
      : 0;

  // จุดที่ 1: คำนวณ Average โดยไม่นับค่า null
  const validAccuracy = history.filter((item) => item.accuracy != null);

  const averageAccuracy =
    validAccuracy.length > 0
      ? validAccuracy.reduce((sum, item) => sum + item.accuracy, 0) /
        validAccuracy.length
      : 0;

  const latestModel = history.length > 0 ? history[0].algorithm : "-";

  // ===== Loading =====
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">Loading Training History...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Training History
        </h1>
        <p className="text-gray-500 mt-2">
          View all previous machine learning training sessions.
        </p>
      </div>

      {/* ===================== Summary Cards ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">Total Training</p>
          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {totalTraining}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">Best Accuracy</p>
          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {(bestAccuracy * 100).toFixed(2)}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">Average Accuracy</p>
          <h2 className="text-4xl font-bold mt-2 text-purple-600">
            {(averageAccuracy * 100).toFixed(2)}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500 text-sm font-medium">Latest Model</p>
          <h2 className="text-xl font-bold mt-2 text-orange-600 leading-tight">
            {latestModel}
          </h2>
        </div>
      </div>

      {/* ===================== Table ===================== */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white uppercase tracking-wide text-sm">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Algorithm</th>
                <th className="p-4 text-center">Accuracy</th>
                <th className="p-4 text-center">Precision</th>
                <th className="p-4 text-center">Recall</th>
                <th className="p-4 text-center">F1</th>
                <th className="p-4 text-center">AUC</th>
                <th className="p-4 text-center">CV</th>
                <th className="p-4 text-center">SMOTE</th>
                <th className="p-4 text-center">Train / Test</th>
                <th className="p-4 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center p-16 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-5xl">📄</span>
                      <p className="text-lg font-medium">No Training History</p>
                      <p className="text-sm text-gray-400">
                        Train your first model.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 text-center hover:bg-blue-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-600 text-left">
                      {item.id}
                    </td>

                    <td className="p-4 font-semibold text-slate-800 text-left">
                      {item.algorithm}
                    </td>

                    {/* จุดที่ 5: ไฮไลต์ Accuracy ที่ดีที่สุด */}
                    <td
                      className={`p-4 ${
                        item.accuracy === bestAccuracy
                          ? "text-green-600 font-bold"
                          : ""
                      }`}
                    >
                      {item.accuracy != null
                        ? `${(item.accuracy * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    <td className="p-4">
                      {item.precision != null
                        ? `${(item.precision * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    <td className="p-4">
                      {item.recall != null
                        ? `${(item.recall * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    <td className="p-4">
                      {item.f1 != null
                        ? `${(item.f1 * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    <td className="p-4">
                      {item.auc != null
                        ? `${(item.auc * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    <td className="p-4">
                      {item.cv_accuracy != null
                        ? `${(item.cv_accuracy * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    <td className="p-4 text-xl">
                      {item.smote ? "✅" : "❌"}
                    </td>

                    {/* จุดที่ 4: แสดงเป็น 80% / 20% */}
                    <td className="p-4 font-medium">
                      {item.train_ratio != null
                        ? `${(item.train_ratio * 100).toFixed(0)}% / ${(
                            100 -
                            item.train_ratio * 100
                          ).toFixed(0)}%`
                        : "-"}
                    </td>

                    {/* จุดที่ 3: จัดรูปแบบวันที่ให้อ่านง่าย */}
                    <td className="p-4 text-sm text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default TrainingHistory;