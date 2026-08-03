// frontend/src/components/Sidebar.jsx

import {
  FaHome,
  FaDatabase,
  FaHeartbeat,
  FaRobot,
  FaBrain,
  FaHistory,
  FaChartBar,
  FaInfoCircle,
  FaNewspaper,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${
      isActive
        ? "bg-cyan-500 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ... ส่วนที่เหลือเหมือนเดิม

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-900 shadow-2xl flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">🩺 Diabetes AI</h1>
        <p className="text-gray-400 text-sm mt-2">Prediction System</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to="/" end className={menuClass}>
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/users" className={menuClass}>
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink to="/upload" className={menuClass}>
          <FaDatabase />
          <span>Upload Dataset</span>
        </NavLink>

        <NavLink to="/predict" className={menuClass}>
          <FaHeartbeat />
          <span>Predict</span>
        </NavLink>

        <NavLink to="/train" className={menuClass}>
          <FaRobot />
          <span>Train Model</span>
        </NavLink>

        <NavLink to="/models" className={menuClass}>
          <FaBrain />
          <span>Models</span>
        </NavLink>

        <NavLink to="/model-information" className={menuClass}>
          <FaInfoCircle />
          <span>Model Information</span>
        </NavLink>

        <NavLink to="/training-history" className={menuClass}>
          <FaChartBar />
          <span>Training History</span>
        </NavLink>

        <NavLink to="/prediction-history" className={menuClass}>
          <FaHistory />
          <span>Prediction History</span>
        </NavLink>

        <NavLink to="/articles" className={menuClass}>
          <FaNewspaper />
          <span>Articles</span>
        </NavLink>

        <NavLink to="/knowledge" className={menuClass}>
          <FaBook />
          <span>Knowledge</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-5">
        <div className="text-white font-semibold">
          👤 {user?.username || "Guest"}
        </div>

        <div className="text-gray-400 text-sm mt-1">
          {user?.email || "-"}
        </div>

        <div className="text-cyan-400 text-sm mt-1">
          Role : {user?.role || "-"}
        </div>

        <button
          onClick={logout}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

        <div className="text-gray-500 text-xs mt-4 text-center">
          Version 1.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;