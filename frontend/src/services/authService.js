import api from "../api/axios";

export const login = async (credentials) => {
  let response;
  try {
    // Coba path 1: /auth/login
    response = await api.post("/auth/login", credentials);
  } catch (err) {
    if (err.response?.status === 404) {
      // Fallback ke path 2: /login (jika backend tidak pakai prefix /auth)
      response = await api.post("/login", credentials);
    } else {
      throw err;
    }
  }

  const data = response.data;
  const token = data.token || data.accessToken;
  const user = data.user || data.data;

  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));

  return data;
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const response = await api.post("/register", userData);
      return response.data;
    }
    throw err;
  }
};

export const registerUser = register;

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded.exp) return false;
    // Beri margin 5 detik
    return Date.now() >= decoded.exp * 1000 - 5000;
  } catch {
    return true;
  }
};

export const logout = (reason = "") => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  const redirectUrl = reason ? `/login?${reason}` : "/login";
  if (typeof window !== "undefined") {
    window.location.href = redirectUrl;
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

