import { useState, useEffect } from "react";
import Layout from "../components/Layout";

function Upload() {
    const [file, setFile] = useState(null);
    const [datasets, setDatasets] = useState([]);

    const loadDatasets = async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/datasets");
            const data = await res.json();
            setDatasets(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadDatasets();
    }, []);

    const uploadFile = async () => {
        if (!file) {
            alert("Please select dataset");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(
                "http://127.0.0.1:5000/upload_dataset",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            alert(data.message);

            setFile(null);

            loadDatasets();

        } catch (err) {
            console.error(err);
            alert("Upload Failed");
        }
    };

    return (
        <Layout>

            <h1 className="text-4xl font-bold mb-8">
                Upload Dataset
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-8">

                <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mb-5"
                />

                <br />

                <button
                    onClick={uploadFile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                    Upload Dataset
                </button>

            </div>

            <div className="bg-white rounded-xl shadow-lg mt-8 overflow-hidden">

                <table className="w-full">

                    <thead className="bg-blue-600 text-white">

                        <tr>

                            <th className="p-3">ID</th>

                            <th>Filename</th>

                            <th>Rows</th>

                            <th>Columns</th>

                        </tr>

                    </thead>

                    <tbody>

                        {datasets.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center p-6"
                                >
                                    No Dataset
                                </td>

                            </tr>

                        ) : (

                            datasets.map(dataset => (

                                <tr
                                    key={dataset.id}
                                    className="border-b text-center"
                                >

                                    <td className="p-3">
                                        {dataset.id}
                                    </td>

                                    <td>
                                        {dataset.filename}
                                    </td>

                                    <td>
                                        {dataset.rows}
                                    </td>

                                    <td>
                                        {dataset.columns}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </Layout>
    );
}

export default Upload;