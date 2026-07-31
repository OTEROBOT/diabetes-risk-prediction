// frontend/src/pages/PredictionHistory.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  FaHeartbeat,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRobot,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaTrash,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 10;

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/prediction_history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.error("Failed to load prediction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRisk, sortBy]);

  // ===== Summary =====
  const total = history.length;
  const highRisk = history.filter((item) => item.prediction === 1).length;
  const lowRisk = history.filter((item) => item.prediction === 0).length;
  const latestModel = history.length > 0 ? history[0].model_name : "-";

  // ===== Filter + Search =====
  const filteredHistory = history.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      String(item.id).includes(keyword) ||
      (item.model_name || "").toLowerCase().includes(keyword);

    const matchRisk =
      filterRisk === "all"
        ? true
        : filterRisk === "high"
        ? item.prediction === 1
        : item.prediction === 0;

    return matchSearch && matchRisk;
  });

  // ===== Sort =====
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "risk_high":
        return (b.risk ?? 0) - (a.risk ?? 0);
      case "risk_low":
        return (a.risk ?? 0) - (b.risk ?? 0);
      case "id_asc":
        return a.id - b.id;
      case "id_desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // ===== Pagination =====
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage) || 1;

  const currentItems = sortedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===== Risk Color =====
  const getRiskColor = (risk) => {
    if (risk == null) return "text-gray-500";
    if (risk >= 90) return "text-red-700 font-bold";
    if (risk >= 70) return "text-red-600 font-bold";
    if (risk >= 50) return "text-orange-500 font-bold";
    return "text-green-600 font-bold";
  };

  const getRiskBarColor = (risk) => {
    if (risk == null) return "bg-gray-400";
    if (risk >= 90) return "bg-red-700";
    if (risk >= 70) return "bg-red-500";
    if (risk >= 50) return "bg-orange-400";
    return "bg-green-500";
  };

  // ===== Delete =====
  const deletePrediction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prediction?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/prediction_history/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Prediction deleted successfully");
      setSelectedItem(null);
      loadHistory();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ===== Export CSV =====
  const exportCSV = () => {
    if (history.length === 0) {
      toast.error("No prediction history.");
      return;
    }

    const headers = ["ID", "Model", "Prediction", "Risk (%)", "Date"];
    const rows = history.map((item) => [
      item.id,
      item.model_name || "-",
      item.prediction === 1 ? "High Risk" : "Low Risk",
      item.risk != null ? item.risk : "-",
      item.created_at || "-",
    ]);

    const csvContent =
      "\uFEFF" + [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prediction_history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully!");
  };

  // ===== Export Excel =====
  const exportExcel = () => {
    if (history.length === 0) {
      toast.error("No prediction history.");
      return;
    }

    const data = history.map((item) => ({
      ID: item.id,
      Model: item.model_name || "-",
      Prediction: item.prediction === 1 ? "High Risk" : "Low Risk",
      "Risk (%)": item.risk != null ? item.risk : "-",
      Date: item.created_at || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prediction History");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "prediction_history.xlsx");
    toast.success("Excel exported successfully!");
  };

  // ===== Export PDF =====
  const exportPDF = () => {
    if (history.length === 0) {
      toast.error("No prediction history.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Prediction History", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString("th-TH")}`, 14, 22);

    const tableData = history.map((item, index) => [
      index + 1,
      item.id,
      item.model_name || "-",
      item.prediction === 1 ? "High Risk" : "Low Risk",
      item.risk != null ? `${item.risk}%` : "-",
      item.created_at || "-",
    ]);

    autoTable(doc, {
      startY: 28,
      head: [["#", "ID", "Model", "Prediction", "Risk", "Date"]],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 41, 59], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save("prediction_history.pdf");
    toast.success("PDF exported successfully!");
  };

  // ===== Loading =====
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">Loading Prediction History...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Prediction History
        </h1>
        <p className="text-gray-500 mt-2">
          View all prediction records generated by the AI model.
        </p>
      </div>

      {/* ===================== Summary Cards ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Prediction All Time
              </p>
              <h2 className="text-4xl font-bold mt-2 text-blue-600">{total}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FaHeartbeat size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">High Risk</p>
              <h2 className="text-4xl font-bold mt-2 text-red-600">{highRisk}</h2>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <FaExclamationTriangle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Risk</p>
              <h2 className="text-4xl font-bold mt-2 text-green-600">{lowRisk}</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FaCheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Latest Model</p>
              <h2 className="text-xl font-bold mt-2 text-purple-600 leading-tight">
                {latestModel}
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <FaRobot size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Search + Filter + Sort + Export ===================== */}
      <div className="mb-6 flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <input
            type="text"
            placeholder="Search by ID or Model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk</option>
            <option value="high">High Risk</option>
            <option value="low">Low Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="risk_high">Risk: High → Low</option>
            <option value="risk_low">Risk: Low → High</option>
            <option value="id_desc">ID: High → Low</option>
            <option value="id_asc">ID: Low → High</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <FaFileCsv />
            Export CSV
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <FaFileExcel />
            Export Excel
          </button>

          <button
            onClick={exportPDF}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <FaFilePdf />
            Export PDF
          </button>
        </div>
      </div>

      {/* ===================== Table ===================== */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 text-white uppercase tracking-wide text-sm">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-center">Prediction</th>
                <th className="p-4 text-center">Risk</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-16 text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-5xl">📄</span>
                      <p className="text-lg font-medium">No Prediction History</p>
                      <p className="text-sm text-gray-400">
                        Make your first prediction.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-blue-50 text-center transition"
                  >
                    <td className="p-4 text-left text-gray-600">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="p-4 text-left font-medium">#{item.id}</td>

                    <td className="p-4 text-left font-semibold text-slate-800">
                      {item.model_name || "-"}
                    </td>

                    <td className="p-4">
                      {item.prediction === 1 ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                          High Risk
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Low Risk
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={getRiskColor(item.risk)}>
                          {item.risk != null ? `${item.risk}%` : "-"}
                        </span>

                        {item.risk != null && (
                          <div className="w-28 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getRiskBarColor(
                                item.risk
                              )}`}
                              style={{ width: `${Math.min(item.risk, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {item.created_at
                        ? new Date(
                            item.created_at.replace(" ", "T")
                          ).toLocaleString("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                          title="View Detail"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() => deletePrediction(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===================== Pagination ===================== */}
        {sortedHistory.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, sortedHistory.length)}
              </span>{" "}
              of <span className="font-semibold">{sortedHistory.length}</span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================== Detail Modal ===================== */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                Prediction Detail
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="text-lg font-bold">#{selectedItem.id}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="text-lg font-bold">
                    {selectedItem.model_name || "-"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Prediction</p>
                  <p className="mt-1">
                    {selectedItem.prediction === 1 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        High Risk
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Low Risk
                      </span>
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <p className={`text-lg font-bold ${getRiskColor(selectedItem.risk)}`}>
                    {selectedItem.risk != null ? `${selectedItem.risk}%` : "-"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 col-span-2">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-lg font-bold">
                    {selectedItem.created_at
                      ? new Date(
                          selectedItem.created_at.replace(" ", "T")
                        ).toLocaleString("th-TH")
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Input Features */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  Input Features
                </h3>

                {selectedItem.input_json &&
                typeof selectedItem.input_json === "object" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedItem.input_json).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-50 border rounded-xl px-4 py-3"
                        >
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {key}
                          </p>
                          <p className="font-semibold text-slate-800">
                            {String(value)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">No input data available</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => deletePrediction(selectedItem.id)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition"
              >
                <FaTrash />
                Delete
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PredictionHistory;