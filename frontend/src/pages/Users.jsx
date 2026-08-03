// frontend/src/pages/Users.jsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Form state
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  async function loadUsers() {
    try {
      const res = await fetch("http://127.0.0.1:5000/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();
    return (
      (user.username || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword) ||
      (user.role || "").toLowerCase().includes(keyword)
    );
  });

  function resetForm() {
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("user");
  }

  async function deleteUser(id) {
    if (!window.confirm("ต้องการลบผู้ใช้งานนี้ใช่หรือไม่?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "ลบไม่สำเร็จ");
        return;
      }

      loadUsers();
    } catch (err) {
      console.log(err);
      alert("ลบไม่สำเร็จ");
    }
  }

  function openEdit(user) {
    setAddingUser(false);
    setEditingUser(user);
    setUsername(user.username || "");
    setEmail(user.email || "");
    setPassword("");
    setRole(user.role || "user");
  }

  function openAdd() {
    setEditingUser(null);
    setAddingUser(true);
    resetForm();
  }

  async function saveUser() {
    if (!username.trim() || !email.trim()) {
      alert("กรุณากรอก Username และ Email");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            role,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "บันทึกไม่สำเร็จ");
        return;
      }

      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err) {
      console.log(err);
      alert("บันทึกไม่สำเร็จ");
    }
  }

  async function addUser() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "เพิ่มผู้ใช้ไม่สำเร็จ");
        return;
      }

      alert("เพิ่มผู้ใช้สำเร็จ");
      setAddingUser(false);
      resetForm();
      loadUsers();
    } catch (err) {
      console.log(err);
      alert("เพิ่มผู้ใช้ไม่สำเร็จ");
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            User Management
          </h1>

          <p className="text-gray-500 mt-2">
            จัดการข้อมูลผู้ใช้งานภายในระบบ
          </p>

          <p className="text-cyan-600 mt-3 font-semibold">
            Total Users : {users.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search username, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            onClick={openAdd}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg whitespace-nowrap"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-400">
                  ไม่พบผู้ใช้งาน
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4 font-semibold">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        user.role === "admin" ? "bg-red-500" : "bg-blue-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openEdit(user)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>

            <label className="block mb-2 font-medium">Username</label>
            <input
              className="border p-3 w-full mb-4 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              className="border p-3 w-full mb-4 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <label className="block mb-2 font-medium">Role</label>
            <select
              className="border p-3 w-full mb-6 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingUser(null);
                  resetForm();
                }}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={saveUser}
                className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addingUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Add User</h2>

            <label className="block mb-2 font-medium">Username</label>
            <input
              className="border w-full p-3 rounded mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              className="border w-full p-3 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              className="border w-full p-3 rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <label className="block mb-2 font-medium">Role</label>
            <select
              className="border w-full p-3 rounded mb-6"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setAddingUser(false);
                  resetForm();
                }}
                className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addUser}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded"
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

export default Users;