import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Nav = () => {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
      <Link to="/">Home</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && <Link to="/profile">Profile</Link>}
      {user && (
        <button onClick={logout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      )}
    </nav>
  );
};

const Home = () => (
  <div style={{ padding: 24 }}>
    <h1>EventSphere</h1>
    <p>Welcome to Event/Expo Management System</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}


