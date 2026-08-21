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
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#60A5FA",
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
              background: "rgba(6,182,212,0.15)",
              border: "1px solid rgba(6,182,212,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06B6D4",
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
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
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
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
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
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C084FC",
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
              background: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A1A1AA",
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
        background: notification.isRead ? "rgba(255,255,255,0.01)" : "rgba(59,130,246,0.06)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: !notification.isRead ? "3px solid #3B82F6" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notification.isRead
          ? "rgba(255,255,255,0.01)"
          : "rgba(59,130,246,0.06)";
      }}
    >
      {getNotificationIcon(notification.type)}

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
          <h4
            style={{
              fontSize: compact ? "0.85rem" : "0.92rem",
              fontWeight: notification.isRead ? 600 : 700,
              color: notification.isRead ? "#E4E4E7" : "#FFFFFF",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notification.title}
          </h4>
          <span style={{ fontSize: "0.7rem", color: "#71717A", flexShrink: 0 }}>
            {formatTime(notification.createdAt)}
          </span>
        </div>

        <p
          style={{
            fontSize: compact ? "0.78rem" : "0.83rem",
            color: "#A1A1AA",
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
            background: "#3B82F6",
            boxShadow: "0 0 6px #3B82F6",
            position: "absolute",
            top: "14px",
            right: "12px",
          }}
        />
      )}
    </div>
  );
}
