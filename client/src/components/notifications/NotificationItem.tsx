"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/notification";
import {
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Award,
  Bell,
  Clock,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  compact?: boolean;
}

export default function NotificationItem({
  notification,
  onMarkRead,
  compact = false,
}: NotificationItemProps) {
  const router = useRouter();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match_found":
        return (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "#FDF4D8",
              border: "1px solid #F5E5B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#92700F",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} />
          </div>
        );
      case "claim_submitted":
        return (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "rgba(234,179,8,0.15)",
              border: "1px solid rgba(234,179,8,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#EAB308",
              flexShrink: 0,
            }}
          >
            <ClipboardCheck size={16} />
          </div>
        );
      case "claim_approved":
        return (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4ADE80",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={16} />
          </div>
        );
      case "claim_rejected":
        return (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F87171",
              flexShrink: 0,
            }}
          >
            <XCircle size={16} />
          </div>
        );
      case "item_resolved":
        return (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "#FDF4D8",
              border: "1px solid #F5E5B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4AF37",
              flexShrink: 0,
            }}
          >
            <Award size={16} />
          </div>
        );
      default:
        return (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "#F9FAFB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B6B6B",
              flexShrink: 0,
            }}
          >
            <Bell size={16} />
          </div>
        );
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;

      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification._id || (notification as any).id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: compact ? "12px 14px" : "16px 20px",
        background: notification.isRead ? "#FFFFFF" : "rgba(212,175,55,0.08)",
        border: "1px solid #F9FAFB",
        borderLeft: !notification.isRead ? "3px solid #D4AF37" : "1px solid #F9FAFB",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F9FAFB";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notification.isRead
          ? "#FFFFFF"
          : "rgba(212,175,55,0.08)";
      }}
    >
      {getNotificationIcon(notification.type)}

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
          <h4
            style={{
              fontSize: compact ? "0.85rem" : "0.92rem",
              fontWeight: notification.isRead ? 600 : 700,
              color: notification.isRead ? "#1A1A1A" : "#F5C842",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notification.title}
          </h4>
          <span style={{ fontSize: "0.7rem", color: "#6B6B6B", flexShrink: 0 }}>
            {formatTime(notification.createdAt)}
          </span>
        </div>

        <p
          style={{
            fontSize: compact ? "0.78rem" : "0.83rem",
            color: "#6B6B6B",
            margin: 0,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#D4AF37",
            boxShadow: "0 0 6px #D4AF37",
            position: "absolute",
            top: "14px",
            right: "12px",
          }}
        />
      )}
    </div>
  );
}
