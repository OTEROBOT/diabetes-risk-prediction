// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  FaRobot,
  FaHeartbeat,
  FaUpload,
  FaCogs,
  FaStethoscope,
  FaList,
  FaTrophy,
  FaClock,
} from "react-icons/fa";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    users: 0,
    datasets: 0,
    models: 0,
    predictions: 0,
    accuracy: 0,
    auc: 0,
    active_model: "-",
    best_model: "-",
    prediction_today: 0,
    high_risk: 0,
    low_risk: 0,
    recent_predictions: [],
    model_accuracies: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/dashboard");
        const data = await res.json();
        setDashboard((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "0.00";
    return (Number(value) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">Loading Dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Diabetes Risk Prediction Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Overview of system performance and prediction statistics
        </p>
      </div>

      {/* ===================== Summary Cards ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Models */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Models</p>
              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                {dashboard.models ?? 0}
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <FaRobot size={28} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Prediction Today */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Prediction Today</p>
              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                {dashboard.prediction_today ?? 0}
              </h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FaClock size={28} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Predictions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Prediction All Time
              </p>
              <h2 className="text-4xl font-bold mt-2 text-red-600">
                {dashboard.predictions ?? 0}
              </h2>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <FaHeartbeat size={28} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Best Model */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Best Model</p>
              <h2 className="text-xl font-bold mt-2 text-green-600 leading-tight">
                {dashboard.best_model || dashboard.active_model || "-"}
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FaTrophy size={28} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Accuracy Progress ===================== */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-slate-700">Best Accuracy</h3>
          <span className="text-2xl font-bold text-cyan-600">
            {formatPercentage(dashboard.accuracy)}%
          </span>
        </div>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000"
            style={{
              width: `${Math.min(Number(dashboard.accuracy || 0) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* ===================== Two Columns: Recent + Distribution ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Predictions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
            <FaList className="text-blue-600" />
            Recent Predictions
          </h3>

          {dashboard.recent_predictions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-gray-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Result</th>
                    <th className="pb-3 font-medium">Risk</th>
                    <th className="pb-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent_predictions.slice(0, 5).map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3 font-medium text-gray-700">
                        #{item.id}
                      </td>
                      <td className="py-3">
                        {item.prediction === 1 ? (
                          <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            High Risk
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            Low Risk
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-semibold">
                        {item.risk ? `${item.risk}%` : "-"}
                      </td>
                      <td className="py-3 text-gray-500 text-xs">
                        {item.created_at || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No recent predictions
            </p>
          )}
        </div>

        {/* Prediction Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Prediction Distribution
          </h3>

          <div className="space-y-6">
            {/* High Risk */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-red-600">High Risk</span>
                <span className="font-bold text-red-600">
                  {dashboard.high_risk ?? 0}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      dashboard.predictions
                        ? (dashboard.high_risk / dashboard.predictions) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Low Risk */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-green-600">Low Risk</span>
                <span className="font-bold text-green-600">
                  {dashboard.low_risk ?? 0}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      dashboard.predictions
                        ? (dashboard.low_risk / dashboard.predictions) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm">High Risk Rate</p>
              <p className="text-2xl font-bold text-red-600">
                {dashboard.predictions
                  ? (
                      (dashboard.high_risk / dashboard.predictions) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Low Risk Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboard.predictions
                  ? (
                      (dashboard.low_risk / dashboard.predictions) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Model Accuracy ===================== */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Model Accuracy Comparison
        </h3>

        {dashboard.model_accuracies?.length > 0 ? (
          <div className="space-y-4">
            {dashboard.model_accuracies.map((model, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-medium text-slate-700">
                    {model.name}
                  </span>
                  <span className="font-bold text-slate-800">
                    {(model.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${model.accuracy * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No model accuracy data available
          </div>
        )}
      </div>

      {/* ===================== Active Model Banner ===================== */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white mb-8">
        <p className="uppercase tracking-widest text-sm opacity-90">
          Current AI Model
        </p>
        <h2 className="text-4xl font-bold mt-2">
          {dashboard.active_model || "No Active Model"}
        </h2>
        <p className="mt-3 opacity-90 max-w-2xl">
          This machine learning model is currently being used for diabetes
          prediction across the system.
        </p>
      </div>

      {/* ===================== Quick Actions ===================== */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/upload"
            className="flex flex-col items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-6 transition group"
          >
            <div className="bg-blue-600 text-white p-4 rounded-full group-hover:scale-110 transition">
              <FaUpload size={24} />
            </div>
            <span className="font-semibold text-blue-700">Upload Dataset</span>
          </Link>

          <Link
            to="/train"
            className="flex flex-col items-center justify-center gap-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-6 transition group"
          >
            <div className="bg-purple-600 text-white p-4 rounded-full group-hover:scale-110 transition">
              <FaCogs size={24} />
            </div>
            <span className="font-semibold text-purple-700">Train Model</span>
          </Link>

          <Link
            to="/predict"
            className="flex flex-col items-center justify-center gap-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-6 transition group"
          >
            <div className="bg-green-600 text-white p-4 rounded-full group-hover:scale-110 transition">
              <FaStethoscope size={24} />
            </div>
            <span className="font-semibold text-green-700">Predict</span>
          </Link>

          <Link
            to="/models"
            className="flex flex-col items-center justify-center gap-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-6 transition group"
          >
            <div className="bg-orange-600 text-white p-4 rounded-full group-hover:scale-110 transition">
              <FaRobot size={24} />
            </div>
            <span className="font-semibold text-orange-700">View Models</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;