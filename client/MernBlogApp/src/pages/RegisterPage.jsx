import React from "react";
import { useState } from "react";

function RegisterPage() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert('Registration Successful')
    }else{
      alert("Registration failed: Username must be unique!");
    }
  }
  return (
    <div className="wrapper">
      <form className="register" onSubmit={handleRegister}>
        <div className="form-content">
          <div className="inputs">
            <h1>Register</h1>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <input
              type="text"
              placeholder="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div className="register-btn">
            <button>Register</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
