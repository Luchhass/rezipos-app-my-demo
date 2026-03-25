import axios from "axios";

// Axios Instance
const api = axios.create({ baseURL: "https://rezivar.com/api" });

// Request Interceptor - Attach Token And Content-Type
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!(config.data instanceof FormData)) config.headers["Content-Type"] = "application/json";
  return config;
});

// Response Interceptor - Handle Auth Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 - Clear Storage And Dispatch Session Expired
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/") {
          window.dispatchEvent(new Event("session-expired"));
        }
      }
    }

    // 403 - Log Permission Warning
    if (status === 403) {
      console.warn("Bu işlem için gerekli yetkiye sahip değilsiniz.");
    }

    return Promise.reject(error);
  },
);

export default api;