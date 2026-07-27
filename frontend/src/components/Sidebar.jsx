import {
  FaHome,
  FaDatabase,
  FaHeartbeat,
  FaRobot,
  FaBrain,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${
      isActive
        ? "bg-cyan-500 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
    }`;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-900 shadow-2xl flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold text-white">
          🩺 Diabetes AI
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Prediction System
        </p>

      </div>

      {/* Menu */}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

        <NavLink to="/" end className={menuClass}>
          <FaHome />
          <span>Dashboard</span>
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

        <NavLink to="/training-history" className={menuClass}>
          <FaChartBar />
          <span>Training History</span>
        </NavLink>

        <NavLink to="/prediction-history" className={menuClass}>
          <FaHistory />
          <span>Prediction History</span>
        </NavLink>

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-700 p-5">

        <div className="text-white font-semibold">
          👤 Administrator
        </div>

        <div className="text-gray-400 text-sm mt-1">
          Diabetes Prediction System
        </div>

        <div className="text-gray-500 text-xs mt-2">
          Version 1.0
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;