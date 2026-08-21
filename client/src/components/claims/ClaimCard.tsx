"use client";

import React, { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Claim } from "@/types/claim";
import {
  MapPin,
  Calendar,
  ChevronDown,
  Check,
  X,
  ShieldCheck,
  FileQuestion,
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ClaimCardProps {
  claim: Claim;
  perspective?: "claimant" | "finder";
  onApprove?: (claim: Claim) => void;
  onReject?: (claim: Claim) => void;
  isProcessing?: boolean;
}

export default function ClaimCard({
  claim,
  perspective = "claimant",
  onApprove,
  onReject,
  isProcessing = false,
}: ClaimCardProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getFullImageUrl = (imgPath?: string) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${backendUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success" dot>Claim Approved</Badge>;
      case "rejected":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "999px",
              color: "#F87171",
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#EF4444" }} />
            Rejected
          </span>
        );
      case "pending":
      default:
        return <Badge variant="warning" dot>Under Review</Badge>;
    }
  };

  const isAutoRejected =
    claim.status === "rejected" &&
    claim.rejectionReason?.toLowerCase().includes("another claim was approved");

  return (
    <div
      style={{
        background: isAutoRejected ? "rgba(30, 20, 37, 0.6)" : "rgba(45, 27, 61, 0.85)",
        border: `1px solid ${
          claim.status === "approved"
            ? "rgba(74, 222, 128, 0.35)"
            : claim.status === "rejected"
            ? "rgba(248, 113, 113, 0.25)"
            : "rgba(212, 175, 55, 0.25)"
        }`,
        borderRadius: "18px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        opacity: isAutoRejected ? 0.75 : 1,
        transition: "all 0.25s ease",
      }}
    >
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        {perspective === "claimant" ? (
          /* Claimant View: Show Found Item Info */
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {claim.foundItem?.images && claim.foundItem.images.length > 0 ? (
                <img
                  src={getFullImageUrl(claim.foundItem.images[0]) || ""}
                  alt={claim.foundItem.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <ShieldCheck size={22} color="#D4AF37" />
              )}
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#F5C842", textTransform: "uppercase" }}>
                {claim.foundItem?.category || "Found Item"}
              </span>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8F5F0", margin: "2px 0 4px" }}>
                {claim.foundItem?.title || "Item Claim"}
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem", color: "#B8AEC2" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={11} color="#D4AF37" /> {claim.foundItem?.location}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={11} /> Submitted {formatDate(claim.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Finder View: Show Claimant User Info */
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Avatar
              src={claim.claimant?.avatar}
              name={claim.claimant?.name || "Claimant"}
              size="md"
              glow={false}
            />
            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", textTransform: "uppercase" }}>
                Ownership Claimant
              </span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#F8F5F0", margin: "2px 0" }}>
                {claim.claimant?.name || "Anonymous User"}
              </h4>
              <span style={{ fontSize: "0.75rem", color: "#B8AEC2" }}>
                Submitted on {formatDate(claim.createdAt)}
              </span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div>{getStatusBadge(claim.status)}</div>
      </div>

      {/* Auto-rejection Note */}
      {isAutoRejected && (
        <div
          style={{
            padding: "8px 12px",
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: "8px",
            fontSize: "0.75rem",
            color: "#F87171",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>Auto-resolved: Finder approved another verified claim for this item.</span>
        </div>
      )}

      {/* Proof Message snippet if claimant provided */}
      {claim.proofMessage && (
        <div
          style={{
            background: "rgba(21, 14, 28, 0.7)",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "0.82rem",
            color: "#B8AEC2",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: "#D4AF37", fontWeight: 600, fontSize: "0.74rem" }}>
            <MessageSquare size={12} /> Claimant Proof Note:
          </div>
          <p style={{ margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>
            "{claim.proofMessage}"
          </p>
        </div>
      )}

      {/* Expandable Q&A Answers Section */}
      {claim.verificationAnswers && claim.verificationAnswers.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowAnswers(!showAnswers)}
            style={{
              background: "transparent",
              border: "none",
              color: "#D4AF37",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: 0,
            }}
          >
            <FileQuestion size={13} />
            <span>
              {showAnswers ? "Hide" : "View"} Verification Q&A ({claim.verificationAnswers.length} questions answered)
            </span>
            <ChevronDown
              size={14}
              style={{
                transform: showAnswers ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {showAnswers && (
            <div
              style={{
                marginTop: "10px",
                background: "rgba(21, 14, 28, 0.8)",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                border: "1px solid rgba(212, 175, 55, 0.15)",
              }}
            >
              {claim.verificationAnswers.map((qa, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "0.76rem", color: "#B8AEC2", fontWeight: 600 }}>
                    Q{idx + 1}: {qa.question}
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "#F8F5F0",
                      background: "rgba(255,255,255,0.04)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      borderLeft: "2px solid #D4AF37",
                    }}
                  >
                    {qa.answer}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Finder Actions (Approve / Reject) if pending */}
      {perspective === "finder" && claim.status === "pending" && onApprove && onReject && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "12px",
          }}
        >
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onReject(claim)}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#F87171",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <X size={14} /> Reject Claim
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onApprove(claim)}
            style={{
              padding: "7px 16px",
              borderRadius: "9px",
              background: "linear-gradient(135deg, #D4AF37, #EAB308)",
              border: "none",
              color: "#150E1C",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 4px 14px rgba(212,175,55,0.35)",
            }}
          >
            <Check size={14} strokeWidth={3} /> Approve Ownership
          </button>
        </div>
      )}
    </div>
  );
}
