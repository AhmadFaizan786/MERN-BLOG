import React from "react";

function LoginPage() {
  return (
    <div className="wrapper">
      <form className="login">
        <div className="form-content">
          <div className="inputs">
            <h1>Login</h1>
            <input type="text" placeholder="username" />
            <input type="text" placeholder="password" />
          </div>
          <div className="login-btn">
            <button>Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
