import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { AuthAPI } from "../lib/api.js";

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(user);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await AuthAPI.profile(token);
        if (isMounted) setProfile(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>;
  if (error) return <div style={{ padding: 24, color: "#b00020" }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Profile</h2>
      <div style={{ marginTop: 12 }}><strong>Name:</strong> {profile?.name}</div>
      <div style={{ marginTop: 12 }}><strong>Email:</strong> {profile?.email}</div>
      <div style={{ marginTop: 12 }}><strong>Role:</strong> {profile?.role}</div>
      <div style={{ marginTop: 12 }}><strong>User ID:</strong> {profile?._id}</div>
    </div>
  );
}


