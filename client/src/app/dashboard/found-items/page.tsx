"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import ItemCard from "@/components/items/ItemCard";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { foundItemService } from "@/services/foundItemService";
import { FoundItem } from "@/types/foundItem";
import {
  PackageCheck,
  PlusCircle,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function MyFoundReportsPage() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Deletion modal
  const [itemToDelete, setItemToDelete] = useState<FoundItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyReports = useCallback(async (targetPage = page) => {
    try {
      setLoading(true);
      const data = await foundItemService.getMyFoundItems(targetPage, 8);
      setItems(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load your found reports";
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
      await foundItemService.deleteFoundItem(itemToDelete._id || itemToDelete.id || "");
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#1E1425" }}>
      <Sidebar variant="user" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Found Item Report"
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
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "rgba(21, 14, 28,0.8)",
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
                background: "rgba(245, 200, 66,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F5C842",
              }}
            >
              <PackageCheck size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F8F5F0" }}>
                My Found Item Reports
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#B8AEC2" }}>
                {total} items found & turned in by you
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => fetchMyReports(page)}
              style={{
                padding: "8px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#B8AEC2",
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
              href="/found/report"
              style={{
                padding: "8px 18px",
                background: "linear-gradient(135deg, #F5C842, #D4AF37)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 16px rgba(245, 200, 66,0.35)",
              }}
            >
              <PlusCircle size={15} />
              Report Found Item
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
                background: "rgba(45, 27, 61,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
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
                  background: "rgba(245, 200, 66,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F5C842",
                  margin: "0 auto 16px",
                }}
              >
                <PackageSearch size={30} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F8F5F0", marginBottom: "6px" }}>
                No found items reported yet
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#B8AEC2", marginBottom: "24px", lineHeight: 1.5 }}>
                Found someone&apos;s phone, wallet, keys, or luggage? Post a found item report to help the owner reclaim it.
              </p>
              <Link
                href="/found/report"
                style={{
                  padding: "12px 22px",
                  background: "linear-gradient(135deg, #F5C842, #D4AF37)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px rgba(245, 200, 66,0.35)",
                }}
              >
                <PlusCircle size={16} />
                Report a Found Item
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {items.map((item) => (
                <ItemCard
                  key={item._id || item.id}
                  item={item}
                  type="found"
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
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: page <= 1 ? "#404050" : "#B8AEC2",
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
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: page >= totalPages ? "#404050" : "#B8AEC2",
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
