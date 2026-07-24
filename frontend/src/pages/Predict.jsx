import { useState } from "react";
import Layout from "../components/Layout";

function Predict() {

    const [form, setForm] = useState({

        HighBP: 0,
        BMI: 25,
        Smoker: 0,
        PhysActivity: 1,
        Fruits: 1,
        Veggies: 1,
        HvyAlcoholConsump: 0,
        GenHlth: 3,
        Sex: 1,
        Age: 9

    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: Number(e.target.value)

        });

    };

    const predict = async () => {

        const res = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(form)
            }
        );

        const data = await res.json();

        setResult(data);

    };

    return (

        <Layout>

            <h1 className="text-3xl font-bold mb-6">

                Diabetes Prediction

            </h1>

            <div className="bg-white p-6 rounded shadow space-y-4">

                <div>

                    <label>High Blood Pressure</label>

                    <select
                        name="HighBP"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="0">No</option>

                        <option value="1">Yes</option>

                    </select>

                </div>

                <div>

                    <label>BMI</label>

                    <input
                        type="number"
                        name="BMI"
                        value={form.BMI}
                        onChange={handleChange}
                        className="border w-full p-2"
                    />

                </div>

                <div>

                    <label>Smoker</label>

                    <select
                        name="Smoker"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="0">No</option>

                        <option value="1">Yes</option>

                    </select>

                </div>

                <div>

                    <label>Physical Activity</label>

                    <select
                        name="PhysActivity"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="1">Yes</option>

                        <option value="0">No</option>

                    </select>

                </div>

                <div>

                    <label>Fruits</label>

                    <select
                        name="Fruits"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="1">Yes</option>

                        <option value="0">No</option>

                    </select>

                </div>

                <div>

                    <label>Vegetables</label>

                    <select
                        name="Veggies"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="1">Yes</option>

                        <option value="0">No</option>

                    </select>

                </div>

                <div>

                    <label>Heavy Alcohol</label>

                    <select
                        name="HvyAlcoholConsump"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="0">No</option>

                        <option value="1">Yes</option>

                    </select>

                </div>

                <div>

                    <label>General Health (1-5)</label>

                    <input
                        type="number"
                        min="1"
                        max="5"
                        name="GenHlth"
                        value={form.GenHlth}
                        onChange={handleChange}
                        className="border w-full p-2"
                    />

                </div>

                <div>

                    <label>Sex</label>

                    <select
                        name="Sex"
                        onChange={handleChange}
                        className="border w-full p-2"
                    >

                        <option value="1">Male</option>

                        <option value="0">Female</option>

                    </select>

                </div>

                <div>

                    <label>Age Group</label>

                    <input
                        type="number"
                        min="1"
                        max="13"
                        name="Age"
                        value={form.Age}
                        onChange={handleChange}
                        className="border w-full p-2"
                    />

                </div>

                <button
                    onClick={predict}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >

                    Predict

                </button>

            </div>

            {result && (

                <div className="bg-white mt-6 p-6 rounded shadow">

                    <h2 className="text-2xl font-bold mb-4">

                        Prediction Result

                    </h2>

                    <p>

                        <b>Model :</b> {result.model}

                    </p>

                    <p>

                        <b>Prediction :</b>{" "}

                        {result.prediction === 1
                            ? "High Risk"
                            : "Low Risk"}

                    </p>

                    <p>

                        <b>Risk :</b> {result.risk}%

                    </p>

                    <p>

                        Probability : {(result.probability * 100).toFixed(2)}%

                    </p>

                </div>

            )}

        </Layout>

    );

}

export default Predict;