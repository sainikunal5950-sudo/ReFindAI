export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  address?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UsersQueryFilters {
  page?: number;
  limit?: number;
  role?: string;
  isBlocked?: string | boolean;
  search?: string;
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
