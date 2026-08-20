import axios from "axios";

/**
 * Axios instance pre-configured with the backend base URL.
 * All API calls in the app should use this instance.
 *
 * Set NEXT_PUBLIC_API_URL in .env.local, e.g.:
 *   NEXT_PUBLIC_API_URL=http://localhost:5000/api
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10-second timeout
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach the JWT token (if present) to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("retrivo_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle 401 Unauthorized globally (token expired / invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("retrivo_token");
        // Redirect to login (or dispatch logout action in Module 2)
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
