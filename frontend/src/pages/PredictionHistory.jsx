import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/prediction_history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Layout>

      <h1 className="text-3xl font-bold mb-6">
        Prediction History
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-800 text-white">

            <tr>

              <th className="p-3">No.</th>

              <th className="p-3">ID</th>

              <th className="p-3">Model</th>

              <th className="p-3">Prediction</th>

              <th className="p-3">Risk</th>

              <th className="p-3">Probability</th>

              <th className="p-3">Date</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-10 text-gray-500"
                >
                  Loading...
                </td>

              </tr>

            ) : history.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-10 text-gray-500"
                >
                  No Prediction History
                </td>

              </tr>

            ) : (

              history.map((item, index) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 text-center"
                >

                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td className="p-3">
                    {item.id}
                  </td>

                  <td className="p-3 font-medium">
                    {item.model_name}
                  </td>

                  <td className="p-3">

                    {item.prediction === 1 ? (

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                        High Risk
                      </span>

                    ) : (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        Low Risk
                      </span>

                    )}

                  </td>

                  <td className="p-3">

                    <span
                      className={
                        item.risk >= 50
                          ? "text-red-600 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {item.risk}%
                    </span>

                  </td>

                  <td className="p-3">

                    {item.probability
                      ? `${(item.probability * 100).toFixed(2)}%`
                      : "-"}

                  </td>

                  <td className="p-3">

                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}

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

export default PredictionHistory;