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

    const data = {

        labels: chartData.map((item, index) => {

            return `${item.model_name} ${index + 1}`;

        }),

        datasets: [

            {

                label: "Accuracy (%)",

                data: chartData.map((item) => (

                    (item.accuracy * 100).toFixed(2)

                )),

                backgroundColor: [

                    "#3B82F6",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                    "#06B6D4",
                    "#EC4899",
                    "#84CC16",
                    "#F97316",
                    "#6366F1"

                ],

                borderRadius: 8,

            }

        ]

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

                    size: 20

                }

            }

        },

        scales: {

            y: {

                beginAtZero: true,

                max: 100,

                ticks: {

                    callback: function (value) {

                        return value + "%";

                    }

                }

            }

        }

    };

    return (

        <>

            <h2 className="text-2xl font-bold mb-5">

                Accuracy Comparison

            </h2>

            <div className="h-[450px]">

                <Bar

                    data={data}

                    options={options}

                />

            </div>

        </>

    );

}

export default DashboardChart;