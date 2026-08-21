import api from "./api";
import {
  FoundItem,
  CreateFoundItemPayload,
  FoundItemsQueryFilters,
  PaginatedFoundItemsResponse,
} from "@/types/foundItem";

export const foundItemService = {
  /**
   * Create a new found item report with optional multiple image files
   */
  async createFoundItem(payload: CreateFoundItemPayload): Promise<{ item: FoundItem }> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", payload.category);
    formData.append("location", payload.location);
    formData.append("date", payload.date);
    if (payload.handoverLocation) {
      formData.append("handoverLocation", payload.handoverLocation);
    }

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.post("/found-items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  /**
   * Public: List found items with search, filters & pagination
   */
  async getAllFoundItems(filters: FoundItemsQueryFilters = {}): Promise<PaginatedFoundItemsResponse> {
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

    const res = await api.get(`/found-items?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Public: Get single found item details by ID
   */
  async getFoundItemById(id: string): Promise<{ item: FoundItem }> {
    const res = await api.get(`/found-items/${id}`);
    return res.data.data;
  },

  /**
   * Protected: Get current user's found item reports
   */
  async getMyFoundItems(page = 1, limit = 10): Promise<PaginatedFoundItemsResponse> {
    const res = await api.get(`/found-items/my?page=${page}&limit=${limit}`);
    return res.data.data;
  },

  /**
   * Protected: Update found item report
   */
  async updateFoundItem(
    id: string,
    data: Partial<CreateFoundItemPayload> & { status?: string },
    newFiles?: File[]
  ): Promise<{ item: FoundItem }> {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);
    if (data.location) formData.append("location", data.location);
    if (data.date) formData.append("date", data.date);
    if (data.handoverLocation) formData.append("handoverLocation", data.handoverLocation);
    if (data.status) formData.append("status", data.status);

    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.put(`/found-items/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  /**
   * Protected: Delete found item report
   */
  async deleteFoundItem(id: string): Promise<{ item: { id: string; title: string } }> {
    const res = await api.delete(`/found-items/${id}`);
    return res.data.data;
  },
};
