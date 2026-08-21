export type NotificationType =
  | "match_found"
  | "claim_submitted"
  | "claim_approved"
  | "claim_rejected"
  | "item_resolved";

export interface Notification {
  _id: string;
  id?: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItem?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
}
