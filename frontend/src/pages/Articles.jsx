// frontend/src/pages/Articles.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API = "http://127.0.0.1:5000";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // เปิด/ปิด Popup
  const [showModal, setShowModal] = useState(false);

  // เก็บ id ที่กำลังแก้ไข
  const [editingId, setEditingId] = useState(null);

  // ฟอร์ม
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  //---------------------------------------
  // โหลดข้อมูลบทความ
  //---------------------------------------
  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API}/articles`);
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------------
  // โหลดตอนเปิดหน้า
  //---------------------------------------
  useEffect(() => {
    fetchArticles();
  }, []);

  //---------------------------------------
  // เปิดฟอร์มเพิ่มบทความ
  //---------------------------------------
  const openAdd = () => {
    setEditingId(null);
    setForm({
      title: "",
      content: "",
      image: "",
    });
    setShowModal(true);
  };

  //---------------------------------------
  // เปิดฟอร์มแก้ไข
  //---------------------------------------
  const openEdit = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title || "",
      content: article.content || "",
      image: article.image || "",
    });
    setShowModal(true);
  };

  //---------------------------------------
  // ลบบทความ
  //---------------------------------------
  const deleteArticle = async (id) => {
    const ok = window.confirm("Delete this article?");
    if (!ok) return;

    try {
      await fetch(`${API}/article/${id}`, {
        method: "DELETE",
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  //---------------------------------------
  // เปลี่ยนค่าฟอร์ม
  //---------------------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //---------------------------------------
  // บันทึกบทความ
  //---------------------------------------
  const saveArticle = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in Title and Content");
      return;
    }

    try {
      if (editingId) {
        await fetch(`${API}/article/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${API}/article`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      }

      setShowModal(false);
      fetchArticles();
    } catch (err) {
      console.error(err);
      alert("Save Failed");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Article Management
          </h1>
          <p className="text-gray-500 mt-2">
                จัดการบทความและองค์ความรู้เกี่ยวกับโรคเบาหวาน โดยสามารถเพิ่ม แก้ไข ลบ และเผยแพร่บทความเพื่อให้ผู้ใช้งานศึกษาผ่านเว็บไซต์ได้
            </p>
        </div>

        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          Add Article
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No Articles
                </td>
              </tr>
            ) : (
              articles.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{item.id}</td>
                  <td className="p-4 font-semibold">{item.title}</td>
                  <td className="p-4">{item.created_at || "-"}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEdit(item)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteArticle(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
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

      {/* ================= Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Article" : "Add Article"}
            </h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter article title"
              />
            </div>

            {/* Image */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Content</label>
              <textarea
                rows={8}
                name="content"
                value={form.content}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write article content..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={saveArticle}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Articles;