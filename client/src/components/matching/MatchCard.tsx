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
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.08)",
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
            background: "#F9FAFB",
            border: "1px solid #E5E5E5",
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
                background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                opacity: 0.8,
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
                color: "#92700F",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {targetItem.category}
            </span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#6B6B6B" }} />
            <span style={{ fontSize: "0.72rem", color: "#6B6B6B" }}>
              {perspective === "lost" ? "Found Report" : "Lost Report"}
            </span>
          </div>

          <Link
            href={detailUrl}
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#1A1A1A",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {targetItem.title}
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "0.78rem",
              color: "#6B6B6B",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={12} color="#D4AF37" />
              {targetItem.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={12} color="#D4AF37" />
              {formatDate(targetItem.date || (targetItem as any).dateLost || (targetItem as any).dateFound)}
            </span>
          </div>
        </div>

        {/* Circular Match Score Ring */}
        <ScoreRing score={match.matchScore} size={72} strokeWidth={6} />
      </div>

      {/* Expandable Breakdown Drawer */}
      {showBreakdown && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            border: "1px solid #FDF4D8",
          }}
        >
          <ScoreBreakdownBar
            label="Category"
            score={match.breakdown?.categorySimilarity ?? 0}
            icon={<Tag size={12} color="#D4AF37" />}
            color="#D4AF37"
          />
          <ScoreBreakdownBar
            label="Text & Keywords"
            score={match.breakdown?.textSimilarity ?? 0}
            icon={<FileText size={12} color="#F5C842" />}
            color="#F5C842"
          />
          <ScoreBreakdownBar
            label="Location"
            score={match.breakdown?.locationSimilarity ?? 0}
            icon={<MapPin size={12} color="#EAB308" />}
            color="#EAB308"
          />
          <ScoreBreakdownBar
            label="Date / Time"
            score={match.breakdown?.timeSimilarity ?? 0}
            icon={<Clock size={12} color="#FBBF24" />}
            color="#FBBF24"
          />
        </div>
      )}

      {/* Action Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #F9FAFB",
          paddingTop: "12px",
          gap: "8px",
        }}
      >
        {/* Toggle Details button */}
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B6B6B",
            fontSize: "0.78rem",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            borderRadius: "6px",
            transition: "all 0.2s",
          }}
        >
          {showBreakdown ? "Hide Breakdown" : "View Breakdown"}
          <ChevronDown
            size={14}
            style={{
              transform: showBreakdown ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </button>

        {/* Match Decision Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Not a Match Button */}
          <button
            type="button"
            onClick={handleRejectClick}
            style={{
              background: "transparent",
              border: "1px solid #F3F4F6",
              color: "#6B6B6B",
              padding: "7px 14px",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248, 113, 113, 0.4)";
              (e.currentTarget as HTMLButtonElement).style.color = "#F87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#F3F4F6";
              (e.currentTarget as HTMLButtonElement).style.color = "#6B6B6B";
            }}
          >
            <X size={14} /> Not a Match
          </button>

          {/* Confirm Match CTA */}
          <button
            type="button"
            onClick={() => onConfirm(match)}
            disabled={isConfirming}
            style={{
              background: "linear-gradient(135deg, #D4AF37, #EAB308)",
              border: "none",
              color: "#FFFFFF",
              padding: "7px 16px",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 4px 14px #F5E5B8",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px #F5E5B8";
            }}
          >
            <Check size={14} strokeWidth={3} />
            {isConfirming ? "Processing..." : "Confirm Match"}
          </button>
        </div>
      </div>
    </div>
  );
}
