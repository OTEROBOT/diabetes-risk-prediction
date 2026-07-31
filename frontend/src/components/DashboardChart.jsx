// frontend/src/components/DashboardChart.jsx

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard_chart")
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];

  const data = {
    labels: chartData.map((item) => item.model_name),
    datasets: [
      {
        label: "Accuracy (%)",
        data: chartData.map((item) => Number(item.accuracy) * 100),
        backgroundColor: chartData.map((_, i) => colors[i % colors.length]),
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Model Accuracy Comparison",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Accuracy: ${context.raw.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5 text-slate-800">
        Accuracy Comparison
      </h2>
      <div className="h-[450px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default DashboardChart;