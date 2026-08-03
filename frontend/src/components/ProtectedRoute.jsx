// frontend/src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role = null }) {
  const token = localStorage.getItem("token");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // ยังไม่ล็อกอิน
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ากำหนด role แล้ว แต่ role ไม่ตรง
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;