import api from "./api";
import { Claim, SubmitClaimPayload, ClaimsListResponse } from "@/types/claim";

export const claimService = {
  /**
   * Submit an ownership claim for a found item
   */
  async submitClaim(payload: SubmitClaimPayload): Promise<{ claim: Claim }> {
    const res = await api.post("/claims", payload);
    return res.data.data;
  },

  /**
   * Get all claims filed for a found item (Finder / Admin only)
   */
  async getClaimsForFoundItem(foundItemId: string): Promise<ClaimsListResponse> {
    const res = await api.get(`/claims/found-item/${foundItemId}`);
    return res.data.data;
  },

  /**
   * Get all claims submitted by the logged-in user
   */
  async getMyClaims(): Promise<ClaimsListResponse> {
    const res = await api.get("/claims/my");
    return res.data.data;
  },

  /**
   * Approve a claim
   */
  async approveClaim(claimId: string): Promise<{ claim: Claim }> {
    const res = await api.patch(`/claims/${claimId}/approve`);
    return res.data.data;
  },

  /**
   * Reject a claim
   */
  async rejectClaim(claimId: string, rejectionReason?: string): Promise<{ claim: Claim }> {
    const res = await api.patch(`/claims/${claimId}/reject`, { rejectionReason });
    return res.data.data;
  },
};
