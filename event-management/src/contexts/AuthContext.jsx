import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "eventsphere_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch {}
    }
  }, []);

  const login = (payload) => {
    setUser({ _id: payload._id, name: payload.name, email: payload.email, role: payload.role });
    setToken(payload.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: payload, token: payload.token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


