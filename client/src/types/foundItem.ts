export type FoundItemCategory =
  | 'Electronics'
  | 'Documents'
  | 'Bags'
  | 'Jewelry'
  | 'Clothing'
  | 'Keys'
  | 'Others'
  | 'Other';

export type FoundItemStatus = 'active' | 'matched' | 'claimed' | 'closed';

export interface FoundItemUser {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
}

export interface FoundItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: FoundItemCategory | string;
  location: string;
  date: string;
  handoverLocation?: string;
  images: string[];
  status: FoundItemStatus;
  user: FoundItemUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoundItemPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  handoverLocation?: string;
  images?: File[];
}

export interface FoundItemsQueryFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaginatedFoundItemsResponse {
  items: FoundItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
