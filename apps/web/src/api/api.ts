import axios from "axios";

const TOKEN_KEY = "nextrep_token";

// IMPORTANT: base should be host only (no trailing slash)
const RAW_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://nextrep.test";
const BASE = RAW_BASE.replace(/\/+$/, ""); // strip trailing /

const api = axios.create({
  baseURL: `${BASE}/api`, //
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default api;
