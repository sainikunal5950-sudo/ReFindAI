import { LostItem } from "./lostItem";
import { FoundItem } from "./foundItem";
import { Claim } from "./claim";
import { Match } from "./match";

export interface AdminStats {
  users: {
    total: number;
  };
  items: {
    totalLost: number;
    totalFound: number;
    totalItems: number;
    resolved: number;
    flagged: number;
  };
  matches: {
    total: number;
    confirmed: number;
  };
  claims: {
    total: number;
    pending: number;
  };
}

export interface AdminLog {
  _id: string;
  admin: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface AdminItemsResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
