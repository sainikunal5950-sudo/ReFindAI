"use client";

import React, { useState } from "react";
import Link from "next/link";
import ScoreRing from "./ScoreRing";
import ScoreBreakdownBar from "./ScoreBreakdownBar";
import { Match } from "@/types/match";
import {
  MapPin,
  Calendar,
  ChevronDown,
  Check,
  X,
  FileText,
  Clock,
  Tag,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface MatchCardProps {
  match: Match;
  perspective?: "lost" | "found";
  onConfirm: (match: Match) => void;
  onReject: (match: Match) => void;
  isConfirming?: boolean;
}

export default function MatchCard({
  match,
  perspective = "lost",
  onConfirm,
  onReject,
  isConfirming = false,
}: MatchCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // If perspective is 'lost', show the corresponding found item, and vice-versa
  const targetItem = perspective === "lost" ? match.foundItem : match.lostItem;
  const detailUrl = perspective === "lost"
    ? `/found/${targetItem?._id || (targetItem as any)?.id}`
    : `/lost/${targetItem?._id || (targetItem as any)?.id}`;

  const getFullImageUrl = (imgPath?: string) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${backendUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const mainImage = targetItem?.images && targetItem.images.length > 0
    ? getFullImageUrl(targetItem.images[0])
    : null;

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

  const handleRejectClick = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onReject(match);
    }, 300);
  };

  if (!targetItem) return null;

  return (
    <div
      style={{
        background: "rgba(18, 20, 28, 0.9)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.08)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? "scale(0.95) translateY(10px)" : "none",
      }}
    >
      {/* Top Main Section */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {/* Thumbnail */}
        <Link
          href={detailUrl}
          style={{
            width: "84px",
            height: "84px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt={targetItem.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                opacity: 0.7,
              }}
            />
          )}
        </Link>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#06B6D4",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {targetItem.category}
            </span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#606070" }} />
            <span style={{ fontSize: "0.72rem", color: "#A1A1AA" }}>
              {perspective === "lost" ? "Found Report" : "Lost Report"}
            </span>
          </div>

          <Link
            href={detailUrl}
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#F5F5F7",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {targetItem.title}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.78rem", color: "#A1A1AA", marginTop: "2px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <MapPin size={12} color="#60A5FA" /> {targetItem.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              <Calendar size={12} color="#606070" /> {formatDate(targetItem.date)}
            </span>
          </div>
        </div>

        {/* Circular Score Ring */}
        <ScoreRing score={match.matchScore} size={68} strokeWidth={5} />
      </div>

      {/* Expandable Score Breakdown Toggle */}
      <button
        type="button"
        onClick={() => setShowBreakdown(!showBreakdown)}
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
        <span>AI Match Breakdown</span>
        <ChevronDown
          size={14}
          style={{
            transform: showBreakdown ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* Breakdown Drawer */}
      {showBreakdown && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            padding: "12px 14px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <ScoreBreakdownBar
            label="Category Match (25%)"
            score={match.breakdown?.categorySimilarity || 0}
            icon={<Tag size={12} color="#06B6D4" />}
            color="#06B6D4"
          />
          <ScoreBreakdownBar
            label="Text & Keywords (30%)"
            score={match.breakdown?.textSimilarity || 0}
            icon={<FileText size={12} color="#3B82F6" />}
            color="#3B82F6"
          />
          <ScoreBreakdownBar
            label="Location Match (25%)"
            score={match.breakdown?.locationSimilarity || 0}
            icon={<MapPin size={12} color="#8B5CF6" />}
            color="#8B5CF6"
          />
          <ScoreBreakdownBar
            label="Time Proximity (20%)"
            score={match.breakdown?.timeSimilarity || 0}
            icon={<Clock size={12} color="#10B981" />}
            color="#10B981"
          />
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", paddingTop: "4px" }}>
        <button
          type="button"
          disabled={isConfirming || match.status === "confirmed"}
          onClick={() => onConfirm(match)}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: match.status === "confirmed"
              ? "rgba(34, 197, 94, 0.2)"
              : "linear-gradient(135deg, #10B981, #059669)",
            border: "none",
            borderRadius: "10px",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: match.status === "confirmed" ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: match.status === "confirmed" ? "none" : "0 4px 14px rgba(16,185,129,0.3)",
          }}
        >
          <Check size={15} />
          {match.status === "confirmed" ? "Match Confirmed" : "Confirm Match"}
        </button>

        {match.status !== "confirmed" && (
          <button
            type="button"
            onClick={handleRejectClick}
            style={{
              padding: "10px 14px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              color: "#A1A1AA",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EF4444";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#A1A1AA";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <X size={14} /> Not a Match
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
