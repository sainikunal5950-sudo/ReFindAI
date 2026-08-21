"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { notificationService } from "@/services/notificationService";
import { authService } from "@/services/authService";
import { Notification } from "@/types/notification";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!authService.getToken()) return;
    try {
      setLoading(true);
      const data = await notificationService.getMyNotifications(1, 10);
      setNotifications(data?.notifications || []);
      setUnreadCount(data?.unreadCount || 0);
    } catch {
      // Ignore background fetch failure if user not logged in
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchNotifications]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn("Failed to mark notification read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn("Failed to mark all read", err);
    }
  };

  // Only show bell if user is authenticated
  if (!authService.getToken()) return null;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: isOpen ? "#FDF4D8" : "#F9FAFB",
          border: isOpen ? "1px solid #F5E5B8" : "1px solid #F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isOpen ? "#F5C842" : "#6B6B6B",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "#FDF4D8";
            e.currentTarget.style.color = "#1A1A1A";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "#F9FAFB";
            e.currentTarget.style.color = "#6B6B6B";
          }
        }}
        title="Notifications"
      >
        <Bell size={18} />

        {/* Unread Badge Counter */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              minWidth: "18px",
              height: "18px",
              padding: "0 4px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #D4AF37, #EAB308)",
              color: "#FFFFFF",
              fontSize: "0.68rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(212,175,55,0.6)",
              border: "2px solid #FFFFFF",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
