// frontend/src/components/RiskPieChart.jsx

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

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

  const total = highRisk + lowRisk;

  const data = {
    labels: ["High Risk", "Low Risk"],
    datasets: [
      {
        data: [highRisk, lowRisk],
        backgroundColor: ["#EF4444", "#10B981"],
        borderColor: ["#DC2626", "#059669"],
        borderWidth: 2,
        cutout: "65%",
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
            const totalValue = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percent =
              totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  // Plugin แสดงตัวเลขตรงกลาง
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();

      const fontSize = (height / 160).toFixed(2);
      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1e293b";

      const text = String(total);
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2 - 10;

      ctx.fillText(text, textX, textY);

      ctx.font = `${(height / 220).toFixed(2)}em sans-serif`;
      ctx.fillStyle = "#64748b";
      const subText = "Total";
      const subX = Math.round((width - ctx.measureText(subText).width) / 2);
      ctx.fillText(subText, subX, textY + 22);

      ctx.save();
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="h-[350px]">
        <Doughnut
          data={data}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>
    </div>
  );
}

export default RiskPieChart;