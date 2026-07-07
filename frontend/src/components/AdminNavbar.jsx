import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Diabetes Admin</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span>
          {user.username} ({user.role})
        </span>

        <button
          onClick={logout}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminNavbar;