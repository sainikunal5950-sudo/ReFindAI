import { FoundItem } from "./foundItem";
import { User } from "./user";

export interface VerificationAnswer {
  question: string;
  answer: string;
}

export type ClaimStatus = "pending" | "approved" | "rejected";

export interface Claim {
  _id: string;
  id?: string;
  foundItem: FoundItem;
  claimant: {
    _id: string;
    id?: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
  };
  verificationAnswers: VerificationAnswer[];
  proofMessage?: string;
  status: ClaimStatus;
  reviewedBy?: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubmitClaimPayload {
  foundItemId: string;
  verificationAnswers: VerificationAnswer[];
  proofMessage?: string;
}

export interface ClaimsListResponse {
  claims: Claim[];
  totalClaims: number;
}
