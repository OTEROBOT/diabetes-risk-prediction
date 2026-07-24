import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function TrainingHistory() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/training_history"
      );

      const data = await response.json();

      setHistory(data);
    } catch (error) {
      console.error("Load Training History Error:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        Training History
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-3">ID</th>

              <th>Algorithm</th>

              <th>Accuracy</th>

              <th>Precision</th>

              <th>Recall</th>

              <th>F1</th>

              <th>AUC</th>

              <th>CV</th>

              <th>SMOTE</th>

              <th>Train Ratio</th>

              <th>Date</th>

            </tr>

          </thead>

          <tbody>

            {history.length === 0 ? (

              <tr>

                <td
                  colSpan="11"
                  className="text-center p-8 text-gray-500"
                >
                  No Training History
                </td>

              </tr>

            ) : (

              history.map((item) => (

                <tr
                  key={item.id}
                  className="border-b text-center hover:bg-gray-50"
                >

                  <td className="p-3">
                    {item.id}
                  </td>

                  <td>
                    {item.algorithm}
                  </td>

                  <td>
                    {(item.accuracy * 100).toFixed(2)}%
                  </td>

                  <td>
                    {(item.precision * 100).toFixed(2)}%
                  </td>

                  <td>
                    {(item.recall * 100).toFixed(2)}%
                  </td>

                  <td>
                    {(item.f1 * 100).toFixed(2)}%
                  </td>

                  <td>
                    {(item.auc * 100).toFixed(2)}%
                  </td>

                  <td>
                    {item.cv_accuracy
                      ? (item.cv_accuracy * 100).toFixed(2) + "%"
                      : "-"}
                  </td>

                  <td className="text-xl">
                    {item.smote ? "✅" : "❌"}
                  </td>

                  <td>
                    {(item.train_ratio * 100).toFixed(0)}%
                  </td>

                  <td>
                    {item.created_at}
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

export default TrainingHistory;