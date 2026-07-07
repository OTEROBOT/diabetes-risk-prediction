import AdminNavbar from "../components/AdminNavbar";

function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <AdminNavbar />

      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>Admin Dashboard</h1>

        <hr />

        <h3>ข้อมูลผู้ใช้</h3>

        <p>Username : {user.username}</p>

        <p>Email : {user.email}</p>

        <p>Role : {user.role}</p>
      </div>
    </>
  );
}

export default Admin;