// src/components/Header.jsx
import ThemeButton from "./ThemeButton";

function Header() {
  return (
    <header
      style={{
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        color: "white",
        padding: "20px 0",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "32px" }}>🩺</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
              Diabetes Risk
            </h1>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
              Machine Learning Prediction
            </p>
          </div>
        </div>

        <ThemeButton />
      </div>
    </header>
  );
}

export default Header;