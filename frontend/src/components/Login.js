import React, { useState } from "react";
import axios from "axios";
import { saveToken } from "../utils/auth";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/login", form);
      saveToken(res.data.access_token);
      setMessage(res.data.message + " Let the battle begin! 🎮");

      localStorage.setItem("token", res.data.access_token); // Store JWT

      setSuccess(true);

      setTimeout(() => {
        navigate(res.data.redirectTo || `/game`); // default to /game if no URL returned
      }, 2000); // 2 seconds delay to show message
    } catch (err) {
      console.log(err, "FAILED");
      setSuccess(false);

      setMessage(
        "❌ Login failed: " +
          (err.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>🕹️ Math Arena Login</h2>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Enter the Arena</button>
        <p className="message-p">{message}</p>
      </form>
    </div>
  );
}

export default Login;
