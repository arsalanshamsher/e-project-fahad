const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiRequest = async (path, { method = "GET", body, token } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const AuthAPI = {
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  profile: (token) => apiRequest("/auth/profile", { token }),
  forgotPassword: (payload) => apiRequest("/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (tokenStr, payload) => apiRequest(`/auth/reset-password/${tokenStr}`, { method: "POST", body: payload })
};


