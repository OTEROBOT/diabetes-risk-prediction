import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Models() {
  const [models, setModels] = useState([]);

  const loadModels = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/models");
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Load Models Error:", error);
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

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Models</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-3">ID</th>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>F1</th>
              <th>AUC</th>
              <th>CV</th>
              <th>Active</th>
              <th>Action</th>
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
                  className="border-b text-center hover:bg-gray-50"
                >

                  <td className="p-3">{model.id}</td>

                  <td>{model.model_name}</td>

                  <td>{(model.accuracy * 100).toFixed(2)}%</td>

                  <td>{(model.precision * 100).toFixed(2)}%</td>

                  <td>{(model.recall * 100).toFixed(2)}%</td>

                  <td>{(model.f1 * 100).toFixed(2)}%</td>

                  <td>{(model.auc * 100).toFixed(2)}%</td>

                  <td>
                    {model.cv_accuracy
                      ? `${(model.cv_accuracy * 100).toFixed(2)}%`
                      : "-"}
                  </td>

                  <td className="text-xl">
                    {model.is_active ? "✅" : "❌"}
                  </td>

                  <td className="space-x-2">

                    {model.is_active ? (

                      <button
                        disabled
                        className="bg-gray-500 text-white px-3 py-1 rounded cursor-not-allowed"
                      >
                        Current Model
                      </button>

                    ) : (

                      <button
                        onClick={() => activateModel(model.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Activate
                      </button>

                    )}

                    <button
                      onClick={() => deleteModel(model.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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