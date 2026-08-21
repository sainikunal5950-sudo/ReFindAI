export type LostItemCategory =
  | 'Electronics'
  | 'Documents'
  | 'Bags'
  | 'Jewelry'
  | 'Clothing'
  | 'Keys'
  | 'Others'
  | 'Other';

export type LostItemStatus = 'active' | 'matched' | 'resolved' | 'closed';

export interface LostItemUser {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
}

export interface LostItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: LostItemCategory | string;
  location: string;
  date: string;
  images: string[];
  status: LostItemStatus;
  user: LostItemUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLostItemPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  images?: File[];
}

export interface LostItemsQueryFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaginatedLostItemsResponse {
  items: LostItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
