// frontend/src/pages/Knowledge.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Knowledge() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/articles");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      return new Date(String(value).replace(" ", "T")).toLocaleString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          ความรู้เกี่ยวกับโรคเบาหวาน
        </h1>
        <p className="text-gray-500 mt-2">
          ศึกษาบทความเกี่ยวกับโรคเบาหวาน ปัจจัยเสี่ยง และแนวทางการดูแลสุขภาพ
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">กำลังโหลดบทความ...</p>
        </div>
      ) : articles.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            ยังไม่มีบทความ
          </h2>
          <p className="text-gray-500">
            ยังไม่มีเนื้อหาให้ศึกษาในขณะนี้
          </p>
        </div>
      ) : (
        /* Articles */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                  <span className="text-5xl">🩺</span>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  {article.title}
                </h2>

                <p className="text-gray-600 leading-8 whitespace-pre-line">
                  {article.content}
                </p>

                <div className="mt-5 pt-4 border-t text-sm text-gray-400">
                  เผยแพร่เมื่อ {formatDate(article.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Knowledge;