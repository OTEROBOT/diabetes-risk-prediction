// frontend/src/components/PredictionTrendChart.jsx

import { useEffect, useState } from "react";
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

function PredictionTrendChart() {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/prediction_trend")
      .then((res) => res.json())
      .then((data) => {
        setTrendData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const data = {
    labels: trendData.map((item) => item.date),
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