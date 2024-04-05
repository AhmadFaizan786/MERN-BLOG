import React, { useContext } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function LoginPage() {

  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const [redirect, setredirect] = useState(false)
  const {setuserInfo,userInfo } = useContext(UserContext) 

  async function handleLogin(e){
    e.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials:'include',
    });
    if(response.ok){
      response.json().then(userInfo =>{
        setuserInfo(userInfo)
      setredirect(true);
      })
    }else{
      alert('wrong credentials');
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <div className="wrapper">
      <form className="login" onSubmit={handleLogin}>
        <div className="form-content">
          <div className="inputs">
            <h1>Login</h1>
            <input type="text" placeholder="username" value={username} onChange={(e) => {setusername(e.target.value)}}/>
            <input type="text" placeholder="password" value={password} onChange={(e)=>{setpassword(e.target.value)}} />
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
