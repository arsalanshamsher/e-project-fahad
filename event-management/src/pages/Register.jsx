import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../lib/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "attendee" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await AuthAPI.register(form);
      login(data);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 12 }}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} style={{ width: "100%" }}>
            <option value="attendee">Attendee</option>
            <option value="exhibitor">Exhibitor</option>
            <option value="admin">Admin/Organizer</option>
          </select>
        </div>
        {error && (
          <div style={{ color: "#b00020", marginTop: 12 }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: 16, width: "100%" }}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
}


