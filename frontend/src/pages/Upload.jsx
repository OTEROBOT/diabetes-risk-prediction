import { useState, useEffect } from "react";
import Layout from "../components/Layout";
//D:\IT29401 โครงงานทางเทคโนโลยีสารสนเทศ\ปี4เทอม1\diabetes-risk-prediction\frontend\src\pages\Upload.jsx
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
      const res = await fetch("http://127.0.0.1:5000/upload_dataset", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
      setFile(null);
      loadDatasets();
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    }
  };

  // แยก downloadDataset ออกมาให้ชัดเจน
  const downloadDataset = (id) => {
    window.open(`http://127.0.0.1:5000/download_dataset/${id}`, "_blank");
  };

  // แก้ไข deleteDataset ให้ทำงานเฉพาะเรื่องลบ
  const deleteDataset = async (id) => {
    if (!window.confirm("Delete this dataset ?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/datasets/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);
      loadDatasets();
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Upload Dataset</h1>

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {datasets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No Dataset
                </td>
              </tr>
            ) : (
              datasets.map((dataset) => (
                <tr key={dataset.id} className="border-b text-center">
                  <td className="p-3">{dataset.id}</td>
                  <td>{dataset.filename}</td>
                  <td>{dataset.rows}</td>
                  <td>{dataset.columns}</td>
                  <td className="space-x-2">
                    {/* เพิ่มปุ่ม Download ในตาราง */}
                    <button
                      onClick={() => downloadDataset(dataset.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => deleteDataset(dataset.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
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