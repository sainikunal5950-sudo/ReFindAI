"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import ItemCard from "@/components/items/ItemCard";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { lostItemService } from "@/services/lostItemService";
import { LostItem } from "@/types/lostItem";
import {
  FileSearch,
  PlusCircle,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function MyLostReportsPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Deletion modal
  const [itemToDelete, setItemToDelete] = useState<LostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyReports = useCallback(async (targetPage = page) => {
    try {
      setLoading(true);
      const data = await lostItemService.getMyLostItems(targetPage, 8);
      setItems(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load your lost reports";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMyReports(1);
  }, []);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await lostItemService.deleteLostItem(itemToDelete._id || itemToDelete.id || "");
      setToast({ type: "success", message: `"${itemToDelete.title}" deleted successfully` });
      setItemToDelete(null);
      fetchMyReports(page);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete item";
      setToast({ type: "error", message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <Sidebar variant="user" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Lost Item Report"
        message={`Are you sure you want to delete your report for "${itemToDelete?.title}"?`}
        confirmText="Delete Report"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Top Header */}
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
            WebkitBackdropFilter: "blur(12px)",
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
                background: "#FDF4D8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D4AF37",
              }}
            >
              <FileSearch size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" }}>
                My Lost Item Reports
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>
                {total} active items reported by you
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => fetchMyReports(page)}
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
              <RefreshCw size={14} />
            </button>
            <Link
              href="/lost/report"
              style={{
                padding: "8px 18px",
                background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 16px #F5E5B8",
              }}
            >
              <PlusCircle size={15} />
              Report New Item
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "32px" }}>
          {loading ? (
            /* Skeleton Loading Grid */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} style={{ height: "340px", borderRadius: "20px" }} className="skeleton" />
              ))}
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div
              style={{
                padding: "72px 20px",
                background: "#FFFFFF",
                border: "1px solid #F9FAFB",
                borderRadius: "24px",
                textAlign: "center",
                maxWidth: "480px",
                margin: "40px auto",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  background: "#FDF4D8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D4AF37",
                  margin: "0 auto 16px",
                }}
              >
                <PackageSearch size={30} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "6px" }}>
                No reports submitted yet
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#6B6B6B", marginBottom: "24px", lineHeight: 1.5 }}>
                Have you lost a phone, wallet, bag, or keys? Post a report and our AI will start matching immediately.
              </p>
              <Link
                href="/lost/report"
                style={{
                  padding: "12px 22px",
                  background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px #F5E5B8",
                }}
              >
                <PlusCircle size={16} />
                Report a Lost Item
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {items.map((item) => (
                <ItemCard
                  key={item._id || item.id}
                  item={item}
                  type="lost"
                  showActions
                  onDelete={(it) => setItemToDelete(it)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "40px" }}>
              <button
                disabled={page <= 1 || loading}
                onClick={() => {
                  const prev = page - 1;
                  setPage(prev);
                  fetchMyReports(prev);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  color: page <= 1 ? "#404050" : "#6B6B6B",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.82rem",
                }}
              >
                <ChevronLeft size={14} /> Prev
              </button>

              <span style={{ fontSize: "0.82rem", color: "#606070", padding: "0 8px" }}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages || loading}
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  fetchMyReports(next);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  color: page >= totalPages ? "#404050" : "#6B6B6B",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.82rem",
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
