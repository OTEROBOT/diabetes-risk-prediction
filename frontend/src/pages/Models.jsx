import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Models() {
  const [models, setModels] = useState([]);
  const bestModel =
  [...models].sort((a, b) => b.accuracy - a.accuracy)[0];
  const [loading, setLoading] = useState(true);

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
        {
          method: "PUT",
        }
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
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      alert(result.message);
      loadModels();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // 1. ส่วนแสดงผลขณะกำลังโหลดข้อมูล
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Loading models...</p>
        </div>
      </Layout>
    );
  }

  // 2. ส่วนแสดงผลตารางเมื่อโหลดข้อมูลเสร็จแล้ว
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Machine Learning Models
        </h1>

        <p className="text-gray-500 mt-2">
          Compare model performance and choose the active model used for diabetes prediction.
        </p>
      </div>

{bestModel && (
  <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl shadow-lg p-6 mb-6">

    <h2 className="text-2xl font-bold">
      🏆 Best Model
    </h2>

    <p className="mt-2 text-xl">
      {bestModel.model_name}
    </p>

    <div className="grid grid-cols-3 gap-6 mt-6">

      <div>
        <p className="text-sm opacity-80">Accuracy</p>
        <p className="text-3xl font-bold">
          {(bestModel.accuracy * 100).toFixed(2)}%
        </p>
      </div>

      <div>
        <p className="text-sm opacity-80">AUC</p>
        <p className="text-3xl font-bold">
          {(bestModel.auc * 100).toFixed(2)}%
        </p>
      </div>

      <div>
        <p className="text-sm opacity-80">CV</p>
        <p className="text-3xl font-bold">
          {(bestModel.cv_accuracy * 100).toFixed(2)}%
        </p>
      </div>

    </div>

  </div>
)}

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white uppercase tracking-wide text-sm">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Model</th>
              <th className="p-3">Accuracy</th>
              <th className="p-3">Precision</th>
              <th className="p-3">Recall</th>
              <th className="p-3">F1</th>
              <th className="p-3">AUC</th>
              <th className="p-3">CV</th>
              <th className="p-3">Active</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {models.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="text-center p-8 text-gray-500"
                >
                  No Models
                </td>
              </tr>
            ) : (
              models.map((model) => (
                <tr
                  key={model.id}
                  className="border-b text-center hover:bg-blue-50 transition"
                >
                  <td className="p-3">{model.id}</td>
                  <td className="p-3">{model.model_name}</td>
                  <td className="p-3">
                    {((model.accuracy ?? 0) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {((model.precision ?? 0) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {((model.recall ?? 0) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {((model.f1 ?? 0) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {((model.auc ?? 0) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {model.cv_accuracy
                      ? `${(model.cv_accuracy * 100).toFixed(2)}%`
                      : "-"}
                  </td>
                  <td className="p-3">
                    {model.is_active ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    {model.is_active ? (
                      <button
                        disabled
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-not-allowed opacity-80"
                      >
                        Using
                      </button>
                    ) : (
                      <button
                        onClick={() => activateModel(model.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => deleteModel(model.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Models;