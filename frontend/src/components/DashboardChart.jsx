import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function DashboardChart({ dashboard }) {

    const data = {

        labels: [

            "Predictions",

            "Models",

            "Datasets",

            "Users"

        ],

        datasets: [

            {

                data: [

                    dashboard.predictions,

                    dashboard.models,

                    dashboard.datasets,

                    dashboard.users

                ],

                backgroundColor: [

                    "#ef4444",

                    "#8b5cf6",

                    "#22c55e",

                    "#3b82f6"

                ],

                borderWidth: 1,

            }

        ]

    };

    return (

        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5">

                System Statistics

            </h2>

            <Pie data={data} />

        </div>

    );

}

export default DashboardChart;