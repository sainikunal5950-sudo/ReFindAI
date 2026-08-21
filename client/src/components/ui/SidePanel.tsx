"use client";

import React, { useEffect } from "react";
import { X, Mail, Phone, MapPin, Calendar, Shield, CheckCircle2, Ban, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import Avatar from "./Avatar";
import Badge from "./Badge";

interface SidePanelProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onToggleBlock?: (user: User) => void;
  onDelete?: (user: User) => void;
  isActionLoading?: boolean;
}

export default function SidePanel({
  isOpen,
  user,
  onClose,
  onToggleBlock,
  onDelete,
  isActionLoading = false,
}: SidePanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          background: "#FFFFFF",
          borderLeft: "1px solid #F9FAFB",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F9FAFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#D4AF37", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              User Profile
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F9FAFB",
              border: "1px solid #F9FAFB",
              borderRadius: "8px",
              color: "#6B6B6B",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#6B6B6B")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* User Hero */}
          <div
            style={{
              padding: "24px",
              background: "linear-gradient(135deg, #F9FAFB, rgba(212, 175, 55,0.04))",
              border: "1px solid #F9FAFB",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "12px",
            }}
          >
            <Avatar src={user.avatar} name={user.name} size="xl" glow />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>
                {user.name}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#6B6B6B" }}>{user.email}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <Badge variant={user.role === "admin" ? "blue" : "neutral"}>
                {user.role.toUpperCase()}
              </Badge>
              <Badge variant={user.isBlocked ? "rejected" : "approved"} dot={!user.isBlocked}>
                {user.isBlocked ? "BLOCKED" : "ACTIVE"}
              </Badge>
            </div>
          </div>

          {/* Details List */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F9FAFB",
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FDF4D8", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37" }}>
                <Mail size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</div>
                <div style={{ fontSize: "0.88rem", color: "#1A1A1A" }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(245, 200, 66,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#92700F" }}>
                <Phone size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</div>
                <div style={{ fontSize: "0.88rem", color: "#1A1A1A" }}>{user.phone || "Not provided"}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A855F7" }}>
                <MapPin size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</div>
                <div style={{ fontSize: "0.88rem", color: "#1A1A1A" }}>{user.address || "Not provided"}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E" }}>
                <Calendar size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Joined On</div>
                <div style={{ fontSize: "0.88rem", color: "#1A1A1A" }}>{formatDate(user.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid #F9FAFB",
            background: "#FFFFFF",
            display: "flex",
            gap: "12px",
          }}
        >
          {onToggleBlock && (
            <button
              disabled={isActionLoading}
              onClick={() => onToggleBlock(user)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                background: user.isBlocked
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(245,158,11,0.12)",
                border: user.isBlocked
                  ? "1px solid rgba(34,197,94,0.3)"
                  : "1px solid rgba(245,158,11,0.3)",
                color: user.isBlocked ? "#4ADE80" : "#FCD34D",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: isActionLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              {user.isBlocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
              {user.isBlocked ? "Unblock User" : "Block User"}
            </button>
          )}

          {onDelete && (
            <button
              disabled={isActionLoading}
              onClick={() => onDelete(user)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#F87171",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: isActionLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
