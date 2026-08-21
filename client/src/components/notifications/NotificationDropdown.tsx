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
        background: "rgba(18, 20, 28, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)",
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
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F5F5F7", margin: 0 }}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span
              style={{
                padding: "2px 8px",
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: "999px",
                color: "#60A5FA",
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
              color: "#3B82F6",
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
          gap: "8px",
          padding: "12px 14px",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ height: "64px", borderRadius: "12px" }} className="skeleton" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#71717A",
                margin: "0 auto 10px",
              }}
            >
              <Bell size={20} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "#F5F5F7", fontWeight: 600, margin: 0 }}>
              No notifications yet
            </p>
            <p style={{ fontSize: "0.75rem", color: "#71717A", margin: "4px 0 0" }}>
              We&apos;ll alert you when matches or claims update.
            </p>
          </div>
        ) : (
          notifications.slice(0, 6).map((notif) => (
            <NotificationItem
              key={notif._id || (notif as any).id}
              notification={notif}
              compact
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>

      {/* Footer link to Notification Center */}
      <div
        style={{
          padding: "12px",
          background: "rgba(255, 255, 255, 0.02)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          textAlign: "center",
        }}
      >
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#60A5FA",
            textDecoration: "none",
          }}
        >
          View All Notifications <ArrowRight size={13} />
        </Link>
      </div>

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
