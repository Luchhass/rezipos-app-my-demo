import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

// Login And Store Token
export const useLogin = () =>
  useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
  });

// Register User
export const useRegister = () =>
  useMutation({
    mutationFn: (userData) => api.post("/auth/register", userData).then((res) => res.data),
  });

// Logout And Clear Storage
export const useLogout = () => {
  const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  return { logout };
};