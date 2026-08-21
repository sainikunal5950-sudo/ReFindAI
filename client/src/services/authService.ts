import api from "./api";
import { User } from "@/types/user";

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data.data;
    if (typeof window !== "undefined") {
      localStorage.setItem("retrivo_token", data.token);
      localStorage.setItem("retrivo_user", JSON.stringify(data.user));
    }
    return data;
  },

  async register(name: string, email: string, password: string, role = "user"): Promise<LoginResponse> {
    const res = await api.post("/auth/register", { name, email, password, role });
    const data = res.data.data;
    if (typeof window !== "undefined") {
      localStorage.setItem("retrivo_token", data.token);
      localStorage.setItem("retrivo_user", JSON.stringify(data.user));
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("retrivo_token");
        localStorage.removeItem("retrivo_user");
        window.location.href = "/login";
      }
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("retrivo_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("retrivo_token");
  },
};
