"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { adminService } from "@/services/adminService";
import { LostItem } from "@/types/lostItem";
import { FoundItem } from "@/types/foundItem";
import {
  Package,
  FileSearch,
  Search,
  AlertTriangle,
  Trash2,
  Flag,
  ExternalLink,
  RefreshCw,
  Filter,
} from "lucide-react";

export default function AdminItemsPage() {
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [items, setItems] = useState<(LostItem | FoundItem)[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [flagFilter, setFlagFilter] = useState(false);

  // Modals
  const [itemToDelete, setItemToDelete] = useState<(LostItem | FoundItem) | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(flagFilter && { isFlagged: true }),
      };

      const data =
        activeTab === "lost"
          ? await adminService.getLostItems(filters, page, 15)
          : await adminService.getFoundItems(filters, page, 15);

      setItems(data?.items || []);
      setTotal(data?.total || 0);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load items";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, statusFilter, flagFilter, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      const id = itemToDelete._id || (itemToDelete as any).id;
      await adminService.removeItem(activeTab, id, "Administrative deletion");
      setToast({ type: "success", message: `Item "${itemToDelete.title}" deleted successfully.` });
      setItemToDelete(null);
      fetchItems();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete item";
      setToast({ type: "error", message: msg });
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFlag = async (item: LostItem | FoundItem) => {
    try {
      const id = item._id || (item as any).id;
      const isCurrentlyFlagged = (item as any).isFlagged;
      await adminService.flagItem(
        activeTab,
        id,
        !isCurrentlyFlagged,
        isCurrentlyFlagged ? "" : "Flagged for manual review by admin"
      );
      setToast({
        type: "info",
        message: `Item flag status ${!isCurrentlyFlagged ? "activated" : "cleared"}.`,
      });
      fetchItems();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update item flag";
      setToast({ type: "error", message: msg });
    }
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="blue" dot>Active</Badge>;
      case "matched":
        return <Badge variant="cyan" dot>Matched</Badge>;
      case "resolved":
      case "claimed":
        return <Badge variant="success" dot>{status === "claimed" ? "Claimed" : "Resolved"}</Badge>;
      case "closed":
      default:
        return <Badge variant="neutral">Closed</Badge>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <Sidebar variant="admin" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title={`Delete ${activeTab === "lost" ? "Lost" : "Found"} Item`}
        message={`Are you sure you want to permanently remove "${itemToDelete?.title}"? All associated matches and claim records will also be removed.`}
        confirmText="Delete Item"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <header
          style={{
            height: "68px",
            borderBottom: "1px solid #F9FAFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "#FFFFFF",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "#FDF4D8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#92700F",
              }}
            >
              <Package size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" }}>
                Platform Items Management
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>
                {total} total {activeTab} item reports
              </p>
            </div>
          </div>

          <button
            onClick={fetchItems}
            style={{
              padding: "8px 12px",
              background: "#F9FAFB",
              border: "1px solid #F9FAFB",
              borderRadius: "10px",
              color: "#6B6B6B",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {/* Tabs & Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                background: "#F9FAFB",
                padding: "4px",
                borderRadius: "12px",
                border: "1px solid #F9FAFB",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab("lost");
                  setPage(1);
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9px",
                  background: activeTab === "lost" ? "linear-gradient(135deg, #D4AF37, #B89628)" : "transparent",
                  color: activeTab === "lost" ? "#FFFFFF" : "#6B6B6B",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FileSearch size={15} /> Lost Items
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("found");
                  setPage(1);
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9px",
                  background: activeTab === "found" ? "linear-gradient(135deg, #F5C842, #0891B2)" : "transparent",
                  color: activeTab === "found" ? "#FFFFFF" : "#6B6B6B",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Package size={15} /> Found Items
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  borderRadius: "10px",
                  padding: "6px 12px",
                  minWidth: "220px",
                }}
              >
                <Search size={14} color="#8E8E93" />
                <input
                  type="text"
                  placeholder="Search title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#1A1A1A",
                    fontSize: "0.84rem",
                    width: "100%",
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "7px 12px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  borderRadius: "10px",
                  color: "#1A1A1A",
                  fontSize: "0.84rem",
                  outline: "none",
                }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="matched">Matched</option>
                <option value={activeTab === "lost" ? "resolved" : "claimed"}>
                  {activeTab === "lost" ? "Resolved" : "Claimed"}
                </option>
                <option value="closed">Closed</option>
              </select>

              {/* Flag Toggle */}
              <button
                type="button"
                onClick={() => {
                  setFlagFilter(!flagFilter);
                  setPage(1);
                }}
                style={{
                  padding: "7px 12px",
                  background: flagFilter ? "rgba(245,158,11,0.2)" : "#F9FAFB",
                  border: flagFilter ? "1px solid rgba(245,158,11,0.4)" : "1px solid #F9FAFB",
                  borderRadius: "10px",
                  color: flagFilter ? "#FCD34D" : "#6B6B6B",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AlertTriangle size={14} /> Flagged Only
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F9FAFB",
              borderRadius: "18px",
              overflow: "hidden",
              backdropFilter: "blur(20px)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F9FAFB" }}>
                  <th style={{ padding: "14px 20px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Item
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Category
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Status
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Reporter
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Date
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase", textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px", textAlign: "center" }}>
                      <RefreshCw size={24} className="animate-spin" color="#F5C842" style={{ margin: "0 auto" }} />
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#8E8E93" }}>
                      No {activeTab} items found matching criteria.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isFlagged = Boolean((item as any).isFlagged);
                    const reporter = (item as any).user;
                    const id = item._id || (item as any).id;

                    return (
                      <tr
                        key={id}
                        style={{
                          borderBottom: "1px solid #F9FAFB",
                          background: isFlagged ? "rgba(245,158,11,0.03)" : "transparent",
                          transition: "background 0.15s",
                        }}
                      >
                        {/* Title & Flag Indicator */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {isFlagged && (
                              <span title={(item as any).flagReason || "Flagged for review"}>
                                <AlertTriangle size={15} color="#F59E0B" />
                              </span>
                            )}
                            <div>
                              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1A1A1A" }}>
                                {item.title}
                              </span>
                              <p style={{ fontSize: "0.75rem", color: "#6B6B6B", margin: "2px 0 0" }}>
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              background: "#F9FAFB",
                              fontSize: "0.76rem",
                              color: "#1A1A1A",
                            }}
                          >
                            {item.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "16px" }}>{getStatusBadge(item.status)}</td>

                        {/* Reporter */}
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Avatar src={reporter?.avatar} name={reporter?.name || "User"} size="sm" />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "#1A1A1A", fontWeight: 500 }}>
                                {reporter?.name || "Unknown"}
                              </span>
                              <p style={{ fontSize: "0.7rem", color: "#8E8E93", margin: 0 }}>
                                {reporter?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td style={{ padding: "16px", fontSize: "0.8rem", color: "#6B6B6B" }}>
                          {formatDate(item.createdAt || item.date)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            {/* View Detail Link */}
                            <Link
                              href={`/${activeTab}/${id}`}
                              target="_blank"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                background: "#F9FAFB",
                                color: "#92700F",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.76rem",
                                textDecoration: "none",
                              }}
                              title="View Public Item Page"
                            >
                              <ExternalLink size={12} /> View
                            </Link>

                            {/* Flag / Unflag */}
                            <button
                              type="button"
                              onClick={() => handleToggleFlag(item)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                background: isFlagged ? "rgba(245,158,11,0.15)" : "#F9FAFB",
                                border: "none",
                                color: isFlagged ? "#FCD34D" : "#6B6B6B",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.76rem",
                                cursor: "pointer",
                              }}
                              title={isFlagged ? "Clear Flag" : "Flag as Suspicious"}
                            >
                              <Flag size={12} /> {isFlagged ? "Flagged" : "Flag"}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                background: "rgba(239,68,68,0.1)",
                                border: "none",
                                color: "#F87171",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "0.76rem",
                                cursor: "pointer",
                              }}
                              title="Delete Item"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
