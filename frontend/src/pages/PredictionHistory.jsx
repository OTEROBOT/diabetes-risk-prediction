import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function PredictionHistory() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        fetch("http://127.0.0.1:5000/prediction_history")
            .then(res => res.json())
            .then(data => {
                setHistory(data);
            });

    }, []);

    return (

        <Layout>

            <h1 className="text-3xl font-bold mb-6">
                Prediction History
            </h1>

            <table className="w-full bg-white shadow rounded">

                <thead className="bg-slate-800 text-white">

                    <tr>

                        <th className="p-3">ID</th>

                        <th className="p-3">Prediction</th>

                        <th className="p-3">Risk (%)</th>

                        <th className="p-3">Date</th>

                    </tr>

                </thead>

                <tbody>

                    {history.map(item => (

                        <tr
                            key={item.id}
                            className="border-b text-center"
                        >

                            <td className="p-3">
                                {item.id}
                            </td>

                            <td className="p-3">
                                {item.prediction === 1
                                    ? "High Risk"
                                    : "Low Risk"}
                            </td>

                            <td className="p-3">
                                {item.risk}%
                            </td>

                            <td className="p-3">
                                {item.created_at}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </Layout>

    );

}

export default PredictionHistory;