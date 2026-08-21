import api from "./api";
import { Notification, NotificationsResponse } from "@/types/notification";

export const notificationService = {
  /**
   * Get paginated notifications with unreadCount
   */
  async getMyNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    const res = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return res.data.data;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<{ notification: Notification }> {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    return res.data.data;
  },

  /**
   * Mark all unread notifications as read
   */
  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    const res = await api.patch("/notifications/read-all");
    return res.data.data;
  },
};
