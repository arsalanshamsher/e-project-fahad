import React, { useState } from "react";
import { AuthAPI } from "../lib/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await AuthAPI.forgotPassword({ email });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%" }} />
        </div>
        {error && <div style={{ color: "#b00020", marginTop: 12 }}>{error}</div>}
        {result && (
          <div style={{ color: "#056608", marginTop: 12 }}>
            {result.message}
            {result.resetUrl && (
              <div style={{ marginTop: 8 }}>
                Test reset URL: <code>{result.resetUrl}</code>
              </div>
            )}
          </div>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: 16, width: "100%" }}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}


