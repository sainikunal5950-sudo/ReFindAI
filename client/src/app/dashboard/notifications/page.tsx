"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import NotificationItem from "@/components/notifications/NotificationItem";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { notificationService } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import {
  Bell,
  CheckCheck,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getMyNotifications(1, 50);
      setNotifications(data?.notifications || []);
      setUnreadCount(data?.unreadCount || 0);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load notifications";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to mark as read";
      setToast({ type: "error", message: msg });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setToast({ type: "success", message: "All notifications marked as read." });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to mark all as read";
      setToast({ type: "error", message: msg });
    }
  };

  // Group notifications by date (Today, Yesterday, Earlier)
  const groupNotifications = (notifs: Notification[]) => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    notifs.forEach((n) => {
      const time = new Date(n.createdAt).getTime();
      if (time >= startOfToday) {
        today.push(n);
      } else if (time >= startOfYesterday) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const { today, yesterday, earlier } = groupNotifications(filteredNotifications);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <Sidebar variant="user" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <header
          style={{
            height: "68px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "rgba(13,15,20,0.8)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(59,130,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#60A5FA",
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7" }}>
                Notification Center
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Filter Toggle */}
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.04)",
                padding: "3px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => setFilter("all")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "7px",
                  background: filter === "all" ? "rgba(59,130,246,0.2)" : "transparent",
                  color: filter === "all" ? "#60A5FA" : "#A1A1AA",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "7px",
                  background: filter === "unread" ? "rgba(59,130,246,0.2)" : "transparent",
                  color: filter === "unread" ? "#60A5FA" : "#A1A1AA",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  padding: "8px 14px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "10px",
                  color: "#60A5FA",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}

            <button
              onClick={fetchNotifications}
              style={{
                padding: "8px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#A1A1AA",
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} style={{ height: "72px", borderRadius: "14px" }} className="skeleton" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div
              style={{
                padding: "72px 20px",
                background: "rgba(18,20,28,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "24px",
                textAlign: "center",
                maxWidth: "460px",
                margin: "40px auto",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  background: "rgba(59,130,246,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3B82F6",
                  margin: "0 auto 16px",
                }}
              >
                <Bell size={28} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F5F5F7", marginBottom: "6px" }}>
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#A1A1AA", margin: 0, lineHeight: 1.5 }}>
                {filter === "unread"
                  ? "You have read all your alerts. Switch to 'All' to view your full history."
                  : "We'll keep you posted when AI matches, claims, or verification updates occur."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* TODAY */}
              {today.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Today
                  </span>
                  {today.map((notif) => (
                    <NotificationItem
                      key={notif._id || (notif as any).id}
                      notification={notif}
                      onMarkRead={handleMarkRead}
                    />
                  ))}
                </div>
              )}

              {/* YESTERDAY */}
              {yesterday.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Yesterday
                  </span>
                  {yesterday.map((notif) => (
                    <NotificationItem
                      key={notif._id || (notif as any).id}
                      notification={notif}
                      onMarkRead={handleMarkRead}
                    />
                  ))}
                </div>
              )}

              {/* EARLIER */}
              {earlier.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Earlier
                  </span>
                  {earlier.map((notif) => (
                    <NotificationItem
                      key={notif._id || (notif as any).id}
                      notification={notif}
                      onMarkRead={handleMarkRead}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
