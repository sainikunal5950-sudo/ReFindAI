import api from "./api";
import { Match, MatchesResponse } from "@/types/match";

export const matchService = {
  /**
   * Get potential found matches for a lost item
   */
  async getMatchesForLostItem(lostItemId: string): Promise<MatchesResponse> {
    const res = await api.get(`/matches/lost/${lostItemId}`);
    return res.data.data;
  },

  /**
   * Get potential lost matches for a found item
   */
  async getMatchesForFoundItem(foundItemId: string): Promise<MatchesResponse> {
    const res = await api.get(`/matches/found/${foundItemId}`);
    return res.data.data;
  },

  /**
   * Get all matches for the current logged-in user
   */
  async getMyMatches(): Promise<MatchesResponse> {
    const res = await api.get("/matches/my");
    return res.data.data;
  },

  /**
   * Confirm a match suggestion
   */
  async confirmMatch(matchId: string): Promise<{ match: Match }> {
    const res = await api.patch(`/matches/${matchId}/confirm`);
    return res.data.data;
  },

  /**
   * Reject a match suggestion
   */
  async rejectMatch(matchId: string): Promise<{ match: Match }> {
    const res = await api.patch(`/matches/${matchId}/reject`);
    return res.data.data;
  },
};
