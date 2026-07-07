import { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register(e) {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:5000/register",
        {
          username,
          email,
          password,
        }
      );

      alert("Register Success");

      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Register Failed");
    }
  }

  return (
    <div
      style={{
        width: "400px",
        margin: "100px auto",
        padding: "30px",
        boxShadow: "0 0 20px #ddd",
      }}
    >
      <h2>Register</h2>

      <form onSubmit={register}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;