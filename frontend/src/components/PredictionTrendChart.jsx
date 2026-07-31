// frontend/src/components/PredictionTrendChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function PredictionTrendChart({ trendData = [] }) {
  // ===== Empty State =====
  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Prediction Trend
        </h2>
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
          <span className="text-5xl mb-4">📈</span>
          <p className="text-lg font-medium text-gray-500">
            No Prediction Yet
          </p>
          <p className="text-sm mt-1">
            Start by making your first prediction.
          </p>
        </div>
      </div>
    );
  }

  const data = {
    labels: trendData.map((item) =>
      new Date(item.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Predictions",
        data: trendData.map((item) => item.count),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Prediction Trend",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default PredictionTrendChart;