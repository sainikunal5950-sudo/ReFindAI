import { LostItem } from "./lostItem";
import { FoundItem } from "./foundItem";

export interface MatchBreakdown {
  textSimilarity: number;
  locationSimilarity: number;
  timeSimilarity: number;
  categorySimilarity: number;
}

export type MatchStatus = "pending" | "confirmed" | "rejected";

export interface Match {
  _id: string;
  id?: string;
  lostItem: LostItem;
  foundItem: FoundItem;
  matchScore: number;
  breakdown: MatchBreakdown;
  status: MatchStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MatchesResponse {
  matches: Match[];
  totalMatches: number;
}
