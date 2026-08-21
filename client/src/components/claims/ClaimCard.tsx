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
        background: isAutoRejected ? "rgba(18, 20, 28, 0.5)" : "rgba(18, 20, 28, 0.85)",
        border: `1px solid ${
          claim.status === "approved"
            ? "rgba(34, 197, 94, 0.3)"
            : claim.status === "rejected"
            ? "rgba(239, 68, 68, 0.2)"
            : "rgba(255, 255, 255, 0.08)"
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
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
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
                <ShieldCheck size={22} color="#06B6D4" />
              )}
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#06B6D4", textTransform: "uppercase" }}>
                {claim.foundItem?.category || "Found Item"}
              </span>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F5F5F7", margin: "2px 0 4px" }}>
                {claim.foundItem?.title || "Item Claim"}
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem", color: "#A1A1AA" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={11} color="#60A5FA" /> {claim.foundItem?.location}
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
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#3B82F6", textTransform: "uppercase" }}>
                Ownership Claimant
              </span>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F7", margin: "2px 0" }}>
                {claim.claimant?.name || "Anonymous User"}
              </h4>
              <span style={{ fontSize: "0.75rem", color: "#606070" }}>
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
          <AlertCircle size={13} /> Auto-rejected — item claimed by another verified user
        </div>
      )}

      {/* Accordion Toggle for Verification Answers */}
      <button
        type="button"
        onClick={() => setShowAnswers(!showAnswers)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "10px",
          color: "#A1A1AA",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FileQuestion size={13} color="#06B6D4" />
          Verification Q&A ({claim.verificationAnswers?.length || 0})
        </span>
        <ChevronDown
          size={14}
          style={{
            transform: showAnswers ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* Verification Answers Content */}
      {showAnswers && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "14px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          {claim.verificationAnswers && claim.verificationAnswers.length > 0 ? (
            claim.verificationAnswers.map((qa, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#60A5FA" }}>
                  Q: {qa.question}
                </span>
                <span style={{ fontSize: "0.82rem", color: "#F5F5F7", paddingLeft: "8px", borderLeft: "2px solid rgba(59,130,246,0.3)" }}>
                  {qa.answer}
                </span>
              </div>
            ))
          ) : (
            <span style={{ fontSize: "0.78rem", color: "#606070" }}>No questions specified</span>
          )}

          {claim.proofMessage && (
            <div style={{ marginTop: "6px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: "0.72rem", color: "#A1A1AA", display: "flex", alignItems: "center", gap: "4px" }}>
                <MessageSquare size={11} /> Additional Claimant Proof Note:
              </span>
              <p style={{ fontSize: "0.82rem", color: "#F5F5F7", marginTop: "2px" }}>
                {claim.proofMessage}
              </p>
            </div>
          )}

          {claim.rejectionReason && !isAutoRejected && (
            <div style={{ marginTop: "6px", padding: "8px", background: "rgba(239,68,68,0.06)", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.72rem", color: "#F87171", fontWeight: 600 }}>
                Rejection Feedback: {claim.rejectionReason}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Finder Actions (Approve / Reject) */}
      {perspective === "finder" && claim.status === "pending" && (
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
          {onApprove && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onApprove(claim)}
              style={{
                flex: 1,
                padding: "9px 14px",
                background: "linear-gradient(135deg, #10B981, #059669)",
                border: "none",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
              }}
            >
              <Check size={14} /> Approve Ownership
            </button>
          )}

          {onReject && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onReject(claim)}
              style={{
                padding: "9px 14px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "10px",
                color: "#F87171",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <X size={14} /> Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
}
