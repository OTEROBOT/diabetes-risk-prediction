// frontend/src/pages/Models.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Models() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // หา Best Model (เรียงตาม Accuracy จากมากไปน้อย)
  const bestModel =
    models.length > 0
      ? [...models].sort((a, b) => b.accuracy - a.accuracy)[0]
      : null;

  // ค่าที่ดีที่สุดของแต่ละ Metric
  const bestAccuracy =
    models.length > 0 ? Math.max(...models.map((m) => m.accuracy ?? 0)) : 0;
  const bestPrecision =
    models.length > 0 ? Math.max(...models.map((m) => m.precision ?? 0)) : 0;
  const bestRecall =
    models.length > 0 ? Math.max(...models.map((m) => m.recall ?? 0)) : 0;
  const bestF1 =
    models.length > 0 ? Math.max(...models.map((m) => m.f1 ?? 0)) : 0;
  const bestAUC =
    models.length > 0 ? Math.max(...models.map((m) => m.auc ?? 0)) : 0;
  const bestCV =
    models.length > 0
      ? Math.max(...models.map((m) => m.cv_accuracy ?? 0))
      : 0;

  const loadModels = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/models");
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const activateModel = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/activate_model/${id}`,
        { method: "PUT" }
      );
      const result = await response.json();
      alert(result.message);
      loadModels();
    } catch (error) {
      console.error(error);
      alert("Activate Failed");
    }
  };

  const deleteModel = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this model?\n\nPrediction will not work until another model is activated."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/delete_model/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      alert(result.message);
      loadModels();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // ===================== Loading State =====================
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
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
          <p className="text-gray-500 text-lg">Loading models...</p>
        </div>
      </Layout>
    );
  }

  // ===================== Main Content =====================
  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-800">
          Machine Learning Models
        </h1>
        <p className="text-gray-500 mt-2">
          Compare model performance and choose the active model used for
          diabetes prediction.
        </p>
      </div>

      {/* ===================== Notice / Explanation Banner ===================== */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-slate-700">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl mt-0.5">ℹ️</span>
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-blue-900 text-base">
              คำอธิบายการจัดเรียงตารางและหมายเลข ID (Table Sorting & Model ID)
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-800">การจัดเรียงตาราง:</strong>{" "}
                โมเดลทั้งหมดจะถูกเรียงลำดับตามความแม่นยำ (<span className="text-blue-600 font-medium">Accuracy</span>) จากมากไปน้อยอัตโนมัติ เพื่อให้คุณเปรียบเทียบและเลือกใช้งานโมเดลที่มีประสิทธิภาพสูงที่สุดได้สะดวก
              </li>
              <li>
                <strong className="text-slate-800">หมายเลข ID:</strong>{" "}
                เป็นรหัสประจำตัวเฉพาะที่สร้างขึ้นตามลำดับการเทรนระบบ ตัวเลขจึงไม่อยู่ในลำดับ 1-2-3 เนื่องจากการเรียงประสิทธิภาพโมเดลและการลบโมเดลเดิมออกจากระบบ
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===================== Best Model Card ===================== */}
      {bestModel && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏆</span>
            <div>
              <h2 className="text-2xl font-bold">Best Model</h2>
              <p className="text-green-100 text-sm">Highest Accuracy</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold mb-6">{bestModel.model_name}</h3>

          {/* Metrics ของ Best Model */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Accuracy</p>
              <p className="text-2xl font-bold">
                {(bestModel.accuracy * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Precision</p>
              <p className="text-2xl font-bold">
                {(bestModel.precision * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Recall</p>
              <p className="text-2xl font-bold">
                {(bestModel.recall * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">F1-Score</p>
              <p className="text-2xl font-bold">
                {(bestModel.f1 * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">AUC</p>
              <p className="text-2xl font-bold">
                {(bestModel.auc * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">CV</p>
              <p className="text-2xl font-bold">
                {bestModel.cv_accuracy
                  ? `${(bestModel.cv_accuracy * 100).toFixed(2)}%`
                  : "-"}
              </p>
            </div>
          </div>

          {/* ตารางเปรียบเทียบแบบย่อ */}
          <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/30">
                  <th className="py-2 pr-4 font-semibold">Model</th>
                  <th className="py-2 px-3 text-center font-semibold">Acc</th>
                  <th className="py-2 px-3 text-center font-semibold">Pre</th>
                  <th className="py-2 px-3 text-center font-semibold">Rec</th>
                  <th className="py-2 px-3 text-center font-semibold">F1</th>
                  <th className="py-2 px-3 text-center font-semibold">AUC</th>
                </tr>
              </thead>
              <tbody>
                {[...models]
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .map((model) => (
                    <tr
                      key={model.id}
                      className="border-b border-white/10 last:border-0 hover:bg-white/5 transition"
                    >
                      <td className="py-2.5 pr-4 font-medium">
                        {model.model_name}
                        {model.id === bestModel.id && (
                          <span className="ml-2 text-yellow-300">★</span>
                        )}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center ${
                          model.accuracy === bestAccuracy
                            ? "text-yellow-300 font-bold"
                            : ""
                        }`}
                      >
                        {model.accuracy === bestAccuracy && "🟢 "}
                        {(model.accuracy * 100).toFixed(2)}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center ${
                          model.precision === bestPrecision
                            ? "text-yellow-300 font-bold"
                            : ""
                        }`}
                      >
                        {model.precision === bestPrecision && "🟢 "}
                        {(model.precision * 100).toFixed(2)}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center ${
                          model.recall === bestRecall
                            ? "text-yellow-300 font-bold"
                            : ""
                        }`}
                      >
                        {model.recall === bestRecall && "🟢 "}
                        {(model.recall * 100).toFixed(2)}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center ${
                          model.f1 === bestF1
                            ? "text-yellow-300 font-bold"
                            : ""
                        }`}
                      >
                        {model.f1 === bestF1 && "🟢 "}
                        {(model.f1 * 100).toFixed(2)}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center ${
                          model.auc === bestAUC
                            ? "text-yellow-300 font-bold"
                            : ""
                        }`}
                      >
                        {model.auc === bestAUC && "🟢 "}
                        {(model.auc * 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== Full Models Table ===================== */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white uppercase tracking-wide text-sm">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-center">Accuracy</th>
                <th className="p-4 text-center">Precision</th>
                <th className="p-4 text-center">Recall</th>
                <th className="p-4 text-center">F1</th>
                <th className="p-4 text-center">AUC</th>
                <th className="p-4 text-center">CV</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {models.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center p-12 text-gray-500 text-lg"
                  >
                    No Models Found
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr
                    key={model.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-600">
                      {model.id}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {model.model_name}
                    </td>

                    {/* Accuracy */}
                    <td
                      className={`p-4 text-center ${
                        model.accuracy === bestAccuracy
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {((model.accuracy ?? 0) * 100).toFixed(2)}%
                    </td>

                    {/* Precision */}
                    <td
                      className={`p-4 text-center ${
                        model.precision === bestPrecision
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {((model.precision ?? 0) * 100).toFixed(2)}%
                    </td>

                    {/* Recall */}
                    <td
                      className={`p-4 text-center ${
                        model.recall === bestRecall
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {((model.recall ?? 0) * 100).toFixed(2)}%
                    </td>

                    {/* F1 */}
                    <td
                      className={`p-4 text-center ${
                        model.f1 === bestF1
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {((model.f1 ?? 0) * 100).toFixed(2)}%
                    </td>

                    {/* AUC */}
                    <td
                      className={`p-4 text-center ${
                        model.auc === bestAUC
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {((model.auc ?? 0) * 100).toFixed(2)}%
                    </td>

                    {/* CV */}
                    <td
                      className={`p-4 text-center ${
                        model.cv_accuracy === bestCV
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {model.cv_accuracy
                        ? `${(model.cv_accuracy * 100).toFixed(2)}%`
                        : "-"}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      {model.is_active ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center space-x-2">
                      {model.is_active ? (
                        <button
                          disabled
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-not-allowed opacity-80 text-sm font-medium"
                        >
                          Using
                        </button>
                      ) : (
                        <button
                          onClick={() => activateModel(model.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}

                      {/* ป้องกันการลบ Active Model */}
                      {model.is_active ? (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          Cannot Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteModel(model.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
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

export default Models;