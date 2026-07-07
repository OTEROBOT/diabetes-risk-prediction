import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Success");

      window.location.href = "/admin";
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  }

  return (
    <div
      style={{
        width: "400px",
        margin: "100px auto",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 20px #ddd",
      }}
    >
      <h2>Login</h2>

      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;