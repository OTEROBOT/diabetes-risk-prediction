// src/components/Footer.jsx
function Footer() {
  return (
    <footer
      style={{
        background: "#f8fafd",
        borderTop: "1px solid #e0e7ff",
        padding: "40px 20px 20px",
        marginTop: "60px",
        color: "#64748b",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p>
          <strong>Developed by Yosawarit Aajonnonla</strong>
        </p>
        <p>Information Technology • Machine Learning Project 2026</p>
        <p style={{ marginTop: "12px", fontSize: "13px" }}>
          โครงการนี้ใช้สำหรับการศึกษาและประเมินความเสี่ยงเบื้องต้นเท่านั้น
          <br />
          ไม่ใช่คำแนะนำทางการแพทย์
        </p>
      </div>
    </footer>
  );
}

export default Footer;