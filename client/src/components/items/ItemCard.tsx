"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Calendar, Trash2, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface ItemCardData {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  images?: string[];
  status: string;
  handoverLocation?: string;
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    avatar?: string;
  };
}

interface ItemCardProps {
  item: ItemCardData;
  type?: "lost" | "found";
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  showActions?: boolean;
}

const categoryGradients: Record<string, [string, string]> = {
  electronics: ["#D4AF37", "#F5C842"],
  documents: ["#059669", "#10B981"],
  bags: ["#A855F7", "#EC4899"],
  jewelry: ["#D4AF37", "#EAB308"],
  clothing: ["#E11D48", "#FB7185"],
  keys: ["#EA580C", "#F97316"],
  others: ["#6B7280", "#9CA3AF"],
  other: ["#6B7280", "#9CA3AF"],
};

export default function ItemCard({
  item,
  type = "lost",
  onEdit,
  onDelete,
  showActions = false,
}: ItemCardProps) {
  const catKey = (item.category || "others").toLowerCase();
  const [c1, c2] = categoryGradients[catKey] || ["#D4AF37", "#F5C842"];
  const detailPath = type === "found" ? `/found/${item._id || item.id}` : `/lost/${item._id || item.id}`;

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
        return <Badge variant="gold" dot>Matched</Badge>;
      case "claimed":
        return <Badge variant="success" dot>Claimed</Badge>;
      case "resolved":
        return <Badge variant="success" dot>Resolved</Badge>;
      case "closed":
        return <Badge variant="neutral">Closed</Badge>;
      case "active":
      default:
        return <Badge variant="gold" dot>Active</Badge>;
    }
  };

  return (
    <article
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 20px #E5E5E5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#E5E5E5";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top Media / Thumbnail */}
      <Link
        href={detailPath}
        style={{
          height: "170px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${c1}25, ${c2}15)`,
          borderBottom: "1px solid #F9FAFB",
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
              opacity: 0.85,
              boxShadow: `0 8px 24px ${c1}40`,
            }}
          />
        )}

        {/* Status Badge */}
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          {getStatusBadge(item.status)}
        </div>

        {/* Category Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            background: "#FFFFFF",
            backdropFilter: "blur(10px)",
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#92700F",
            border: "1px solid #F5E5B8",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {item.category}
        </div>
      </Link>

      {/* Body Content */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {/* Title */}
        <Link
          href={detailPath}
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1A1A1A",
            textDecoration: "none",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.title}
        </Link>

        {/* Description snippet */}
        <p
          style={{
            fontSize: "0.84rem",
            color: "#6B6B6B",
            lineHeight: 1.5,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description || "No description provided."}
        </p>

        {/* Metadata Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#6B6B6B" }}>
            <MapPin size={13} color="#D4AF37" style={{ flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.location}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#6B6B6B" }}>
            <Calendar size={13} color="#D4AF37" style={{ flexShrink: 0 }} />
            <span>{formatDate(item.date)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid #F9FAFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {showActions ? (
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
              <Link
                href={detailPath}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "#FDF4D8",
                  border: "1px solid #F5E5B8",
                  borderRadius: "8px",
                  color: "#92700F",
                  fontWeight: 700,
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
              <span style={{ fontSize: "0.75rem", color: "#6B6B6B" }}>
                By {item.user?.name ? item.user.name.split(" ")[0] : "Finder"}
              </span>

              <Link
                href={detailPath}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  background: "#FDF4D8",
                  border: "1px solid #F5E5B8",
                  borderRadius: "8px",
                  color: "#92700F",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E5E5E5";
                  e.currentTarget.style.boxShadow = "0 0 12px #F5E5B8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FDF4D8";
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
