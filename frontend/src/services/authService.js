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

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
