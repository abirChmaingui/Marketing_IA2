import axios from "axios";
import { mockUser } from "./mockData";
import type { User } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (email && password.length >= 6) {
      const token = "mock-jwt-token-" + Date.now();
      localStorage.setItem("auth_token", token);
      return { user: { ...mockUser, email }, token };
    }
    throw new Error("Identifiants invalides");
  },

  async logout(): Promise<void> {
    localStorage.removeItem("auth_token");
  },

  async getCurrentUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUser;
  },
};

export default api;
