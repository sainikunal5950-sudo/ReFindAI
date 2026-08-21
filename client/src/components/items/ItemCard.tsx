"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Calendar, User as UserIcon, Edit, Trash2, ArrowRight } from "lucide-react";
import { LostItem } from "@/types/lostItem";
import Badge from "@/components/ui/Badge";

interface ItemCardProps {
  item: LostItem;
  type?: "lost" | "found";
  onEdit?: (item: LostItem) => void;
  onDelete?: (item: LostItem) => void;
  showActions?: boolean;
}

const categoryGradients: Record<string, [string, string]> = {
  electronics: ["#2563EB", "#06B6D4"],
  documents: ["#059669", "#10B981"],
  bags: ["#7C3AED", "#6366F1"],
  jewelry: ["#D97706", "#F59E0B"],
  clothing: ["#DB2777", "#EC4899"],
  keys: ["#DC2626", "#EF4444"],
  others: ["#475569", "#64748B"],
  other: ["#475569", "#64748B"],
};

export default function ItemCard({
  item,
  type = "lost",
  onEdit,
  onDelete,
  showActions = false,
}: ItemCardProps) {
  const catKey = (item.category || "others").toLowerCase();
  const [c1, c2] = categoryGradients[catKey] || ["#3B82F6", "#06B6D4"];

  const getFullImageUrl = (imgPath?: string) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${backendUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const mainImage = item.images && item.images.length > 0 ? getFullImageUrl(item.images[0]) : null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return <Badge variant="cyan" dot>Matched</Badge>;
      case "resolved":
        return <Badge variant="success" dot>Resolved</Badge>;
      case "closed":
        return <Badge variant="neutral">Closed</Badge>;
      case "active":
      default:
        return <Badge variant="blue" dot>Active</Badge>;
    }
  };

  return (
    <article
      style={{
        background: "rgba(18,20,28,0.9)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(59,130,246,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top Media / Thumbnail */}
      <Link
        href={`/lost/${item._id || item.id}`}
        style={{
          height: "170px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${c1}25, ${c2}15)`,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
          textDecoration: "none",
        }}
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              opacity: 0.8,
              boxShadow: `0 8px 24px ${c1}40`,
            }}
          />
        )}

        {/* Status Badge */}
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          {getStatusBadge(item.status)}
        </div>

        {/* Category Tag */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            padding: "4px 10px",
            background: "rgba(10,10,15,0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#F5F5F7",
            letterSpacing: "0.02em",
          }}
        >
          {item.category}
        </div>
      </Link>

      {/* Body Content */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <Link
          href={`/lost/${item._id || item.id}`}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#F5F5F7",
              marginBottom: "8px",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#60A5FA")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#F5F5F7")}
          >
            {item.title}
          </h3>
        </Link>

        <p
          style={{
            fontSize: "0.83rem",
            color: "#A1A1AA",
            lineHeight: 1.5,
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {item.description}
        </p>

        {/* Location & Date */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#A1A1AA" }}>
            <MapPin size={13} color="#60A5FA" style={{ flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.location}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#606070" }}>
            <Calendar size={13} style={{ flexShrink: 0 }} />
            <span>Lost on {formatDate(item.date)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {showActions ? (
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
              <Link
                href={`/lost/${item._id || item.id}`}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "8px",
                  color: "#60A5FA",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                View Details
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  style={{
                    padding: "8px 10px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "8px",
                    color: "#F87171",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ) : (
            <>
              <span style={{ fontSize: "0.75rem", color: "#606070" }}>
                By {item.user?.name ? item.user.name.split(" ")[0] : "Community"}
              </span>

              <Link
                href={`/lost/${item._id || item.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "8px",
                  color: "#60A5FA",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.2)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(59,130,246,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Details <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
