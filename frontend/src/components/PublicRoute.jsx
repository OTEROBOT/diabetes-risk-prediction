// frontend/src/components/PublicRoute.jsx

import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // ถ้า login แล้ว ไม่ให้เข้า Login/Register ซ้ำ
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;