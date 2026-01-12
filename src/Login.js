import React, { useState } from "react";

const BASE_URL = "http://localhost:8080";

export default function Login({ onLogin }) {

  const [role, setRole] = useState("doctor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");

  const login = async () => {
    if (!username || !password) {
      setMsg("Please fill all fields");
      return;
    }

    const res = await fetch(BASE_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, username, password })
    });

    if (!res.ok) {
      setMsg("Invalid Credentials");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966484.png"
          alt="hospital"
        />

        <h2>Hospital Management System</h2>
        <p>Secure Login</p>

        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>

        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button onClick={login}>Login</button>

        {msg && <p className="error">{msg}</p>}
      </div>

      {/* STYLES */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI';
          background: linear-gradient(135deg,#1CB5E0,#000851);
        }

        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-card {
          background: white;
          padding: 40px;
          width: 350px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .login-card img {
          width: 90px;
          margin-bottom: 15px;
        }

        .login-card h2 {
          margin-bottom: 5px;
        }

        .login-card p {
          color: #777;
          margin-bottom: 20px;
        }

        select, input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }

        .password-box {
          position: relative;
        }

        .password-box span {
          position: absolute;
          right: 12px;
          top: 12px;
          cursor: pointer;
        }

        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(45deg,#36D1DC,#5B86E5);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
        }

        button:hover {
          opacity: 0.9;
        }

        .error {
          margin-top: 15px;
          color: red;
        }
      `}</style>
    </div>
  );
}
