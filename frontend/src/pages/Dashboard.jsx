import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardChart from "../components/DashboardChart";
import {
  FaUsers,
  FaDatabase,
  FaRobot,
  FaHeartbeat,
  FaBullseye,
  FaChartLine,
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
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setDashboard(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ฟังก์ชันป้องกัน Error กรณีค่า accuracy หรือ auc เป็น null/undefined
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "0.00";
    return (Number(value) * 100).toFixed(2);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-slate-800">
        Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Users */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Users</p>
              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                {dashboard.users ?? 0}
              </h2>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <FaUsers size={35} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Dataset */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Datasets</p>
              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {dashboard.datasets ?? 0}
              </h2>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <FaDatabase size={35} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Models */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Models</p>
              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                {dashboard.models ?? 0}
              </h2>
            </div>
            <div className="bg-purple-100 p-4 rounded-full">
              <FaRobot size={35} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Prediction */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Predictions</p>
              <h2 className="text-4xl font-bold mt-2 text-red-600">
                {dashboard.predictions ?? 0}
              </h2>
            </div>
            <div className="bg-red-100 p-4 rounded-full">
              <FaHeartbeat size={35} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Accuracy</p>
              <h2 className="text-4xl font-bold mt-2 text-cyan-600">
                {formatPercentage(dashboard.accuracy)}%
              </h2>
            </div>
            <div className="bg-cyan-100 p-4 rounded-full">
              <FaBullseye size={35} className="text-cyan-600" />
            </div>
          </div>
        </div>

        {/* AUC */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">AUC Score</p>
              <h2 className="text-4xl font-bold mt-2 text-orange-500">
                {formatPercentage(dashboard.auc)}%
              </h2>
            </div>
            <div className="bg-orange-100 p-4 rounded-full">
              <FaChartLine size={35} className="text-orange-500" />
            </div>
          </div>
        </div>

      </div>

      {/* Active Model Section */}
      <div className="mt-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white">
        <p className="uppercase tracking-widest text-sm opacity-90">
          Current AI Model
        </p>
        <h2 className="text-4xl font-bold mt-3">
          {dashboard.active_model || "No Active Model"}
        </h2>
        <p className="mt-4 opacity-90">
          This machine learning model is currently being used for diabetes prediction.
        </p>
      </div>

      {/* Chart Section */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg">
        <DashboardChart />
      </div>
    </Layout>
  );
}

export default Dashboard;