// frontend/src/components/RiskPieChart.jsx

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function RiskPieChart() {
  const [highRisk, setHighRisk] = useState(0);
  const [lowRisk, setLowRisk] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setHighRisk(data.high_risk || 0);
        setLowRisk(data.low_risk || 0);
      })
      .catch((err) => console.error(err));
  }, []);

  const data = {
    labels: ["High Risk", "Low Risk"],
    datasets: [
      {
        data: [highRisk, lowRisk],
        backgroundColor: ["#EF4444", "#10B981"],
        borderColor: ["#DC2626", "#059669"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Risk Distribution",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="h-[350px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default RiskPieChart;