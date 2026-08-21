import api from "./api";
import { AdminStats, AdminLog, AdminItemsResponse } from "@/types/admin";
import { LostItem } from "@/types/lostItem";
import { FoundItem } from "@/types/foundItem";
import { Claim, ClaimsListResponse } from "@/types/claim";
import { Match, MatchesResponse } from "@/types/match";

export const adminService = {
  /**
   * Get aggregated platform dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    const res = await api.get("/admin/stats");
    return res.data.data;
  },

  /**
   * Get all lost items platform-wide
   */
  async getLostItems(
    filters: { status?: string; category?: string; isFlagged?: boolean; search?: string } = {},
    page = 1,
    limit = 20
  ): Promise<AdminItemsResponse<LostItem>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
      ...(filters.isFlagged !== undefined && { isFlagged: String(filters.isFlagged) }),
      ...(filters.search && { search: filters.search }),
    });
    const res = await api.get(`/admin/lost-items?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Get all found items platform-wide
   */
  async getFoundItems(
    filters: { status?: string; category?: string; isFlagged?: boolean; search?: string } = {},
    page = 1,
    limit = 20
  ): Promise<AdminItemsResponse<FoundItem>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
      ...(filters.isFlagged !== undefined && { isFlagged: String(filters.isFlagged) }),
      ...(filters.search && { search: filters.search }),
    });
    const res = await api.get(`/admin/found-items?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Remove any lost or found item
   */
  async removeItem(type: "lost" | "found", id: string, reason?: string): Promise<{ success: boolean }> {
    const res = await api.delete(`/admin/items/${type}/${id}`, { data: { reason } });
    return res.data.data;
  },

  /**
   * Flag or unflag item for suspicious activity
   */
  async flagItem(
    type: "lost" | "found",
    id: string,
    isFlagged: boolean,
    flagReason?: string
  ): Promise<{ item: any }> {
    const res = await api.patch(`/admin/items/${type}/${id}/flag`, { isFlagged, flagReason });
    return res.data.data;
  },

  /**
   * Get all claims platform-wide
   */
  async getClaims(status?: string, page = 1, limit = 20): Promise<ClaimsListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status && { status }),
    });
    const res = await api.get(`/admin/claims?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Get all matches platform-wide
   */
  async getMatches(status?: string, page = 1, limit = 20): Promise<MatchesResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status && { status }),
    });
    const res = await api.get(`/admin/matches?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Get admin audit logs
   */
  async getLogs(page = 1, limit = 30): Promise<{ logs: AdminLog[]; total: number; totalPages: number }> {
    const res = await api.get(`/admin/logs?page=${page}&limit=${limit}`);
    return res.data.data;
  },
};
