import api from "./api";
import { User, UpdateProfileDTO, UsersQueryFilters, PaginatedUsersResponse } from "@/types/user";

export const userService = {
  /**
   * Fetch current user's profile
   */
  async getProfile(): Promise<{ user: User }> {
    const res = await api.get("/users/me");
    return res.data.data;
  },

  /**
   * Update current user's profile
   */
  async updateProfile(data: UpdateProfileDTO): Promise<{ user: User }> {
    const res = await api.put("/users/me", data);
    return res.data.data;
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<{ avatar: string; user: User }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  /**
   * Admin: List all users with filtering and pagination
   */
  async getAllUsers(filters: UsersQueryFilters = {}): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.role && filters.role !== "all") params.append("role", filters.role);
    if (filters.isBlocked !== undefined && filters.isBlocked !== "all" && filters.isBlocked !== "") {
      params.append("isBlocked", String(filters.isBlocked));
    }
    if (filters.search) params.append("search", filters.search);

    const res = await api.get(`/users?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Admin: Get single user by ID
   */
  async getUserById(id: string): Promise<{ user: User }> {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },

  /**
   * Admin: Delete a user
   */
  async deleteUser(id: string): Promise<{ user: { id: string; email: string } }> {
    const res = await api.delete(`/users/${id}`);
    return res.data.data;
  },

  /**
   * Admin: Block/Unblock a user
   */
  async toggleBlockUser(id: string, isBlocked?: boolean): Promise<{ user: User }> {
    const body = isBlocked !== undefined ? { isBlocked } : {};
    const res = await api.patch(`/users/${id}/block`, body);
    return res.data.data;
  },
};
