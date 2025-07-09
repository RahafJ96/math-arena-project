import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/register", form);
      console.log(res.data);

      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        "❌ Registration failed: " +
          (err.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>🧠 Register to Math Arena</h2>
        <input
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <input
          name="username"
          placeholder="Choose a Username"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Choose a Password"
          onChange={handleChange}
        />
        <button type="submit">Join the Arena</button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default Register;
