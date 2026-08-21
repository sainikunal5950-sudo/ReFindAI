import api from "./api";
import {
  LostItem,
  CreateLostItemPayload,
  LostItemsQueryFilters,
  PaginatedLostItemsResponse,
} from "@/types/lostItem";

export const lostItemService = {
  /**
   * Create a new lost item report with optional multiple image files
   */
  async createLostItem(payload: CreateLostItemPayload): Promise<{ item: LostItem }> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", payload.category);
    formData.append("location", payload.location);
    formData.append("date", payload.date);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.post("/lost-items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  /**
   * Public: List lost items with search, filters & pagination
   */
  async getAllLostItems(filters: LostItemsQueryFilters = {}): Promise<PaginatedLostItemsResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.category && filters.category !== "all" && filters.category !== "All") {
      params.append("category", filters.category);
    }
    if (filters.location) params.append("location", filters.location);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.search) params.append("search", filters.search);

    const res = await api.get(`/lost-items?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Public: Get single lost item details by ID
   */
  async getLostItemById(id: string): Promise<{ item: LostItem }> {
    const res = await api.get(`/lost-items/${id}`);
    return res.data.data;
  },

  /**
   * Protected: Get current user's lost item reports
   */
  async getMyLostItems(page = 1, limit = 10): Promise<PaginatedLostItemsResponse> {
    const res = await api.get(`/lost-items/my?page=${page}&limit=${limit}`);
    return res.data.data;
  },

  /**
   * Protected: Update lost item report
   */
  async updateLostItem(
    id: string,
    data: Partial<CreateLostItemPayload> & { status?: string },
    newFiles?: File[]
  ): Promise<{ item: LostItem }> {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);
    if (data.location) formData.append("location", data.location);
    if (data.date) formData.append("date", data.date);
    if (data.status) formData.append("status", data.status);

    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.put(`/lost-items/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  /**
   * Protected: Delete lost item report
   */
  async deleteLostItem(id: string): Promise<{ item: { id: string; title: string } }> {
    const res = await api.delete(`/lost-items/${id}`);
    return res.data.data;
  },
};
