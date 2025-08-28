import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../lib/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await AuthAPI.login(form);
      login(data);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        {error && (
          <div style={{ color: "#b00020", marginTop: 12 }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: 16, width: "100%" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <Link to="/register">Create an account</Link>
      </div>
      <div style={{ marginTop: 12 }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
}


