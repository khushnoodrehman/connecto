import React from 'react'
import Logo from "../../components/ui/Logo/Logo.jsx"
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../../providers/AuthContext.jsx"
import "./Login.css"  // import CSS

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [log, setLog] = useState("Login")
  const { setAuth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const validateForm = () => {
    return (
      formData.username && formData.password !== ""
    )
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLog("Loading...")
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        body: JSON.stringify(formData),
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setAuth({ isLoggedIn: true, user: data.user })
        navigate('/feed')
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='Login'>
      <div className="header">
        <Logo size="lg" />
      </div>

      <br />

      <div className="LoginCard">
        <p className="cardTitle">Login to Connecto</p>

        <form onSubmit={handleSubmit}>
          <input type="username" name='username' value={formData.username} onChange={handleChange} placeholder='Username' />

          <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder='Password' />

          <button type='submit' disabled={log === "Loading..." ? validateForm() : !validateForm()}>{log}</button>

          <p className="smallLink">Forgotten account?</p>
          <Link to='/signup' className='smallLink'><p className="smallLink">Sign up for Connect</p></Link>
        </form>
      </div>
    </div>
  )
}

export default Login;
