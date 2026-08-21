"use client";

import React from "react";
import Link from "next/link";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/notification";
import { Bell, CheckCheck, ArrowRight } from "lucide-react";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading,
  onMarkRead,
  onMarkAllRead,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: "360px",
        maxWidth: "90vw",
        background: "rgba(30, 20, 37, 0.96)",
        border: "1px solid rgba(212, 175, 55, 0.25)",
        borderRadius: "20px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.1)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "dropdownFadeIn 0.2s ease-out",
      }}
    >
      {/* Dropdown Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8F5F0", margin: 0 }}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span
              style={{
                padding: "2px 8px",
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "999px",
                color: "#F5C842",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            style={{
              background: "transparent",
              border: "none",
              color: "#D4AF37",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {/* Notification List Container */}
      <div
        style={{
          maxHeight: "360px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading && notifications.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#B8AEC2", fontSize: "0.84rem" }}>
            Loading updates...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(212,175,55,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D4AF37",
              }}
            >
              <Bell size={20} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "#B8AEC2", margin: 0 }}>
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationItem
              key={item._id}
              notification={item}
              onMarkRead={onMarkRead}
              compact
            />
          ))
        )}
      </div>

      {/* Dropdown Footer */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          background: "rgba(21, 14, 28, 0.7)",
          textAlign: "center",
        }}
      >
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#D4AF37",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          View All Notifications <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
