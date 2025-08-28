import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthAPI } from "../lib/api.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await AuthAPI.resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 12 }}>
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </div>
        {error && <div style={{ color: "#b00020", marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: "#056608", marginTop: 12 }}>Password updated. Redirecting...</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 16, width: "100%" }}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}


