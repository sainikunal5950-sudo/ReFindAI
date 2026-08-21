"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { adminService } from "@/services/adminService";
import { Claim } from "@/types/claim";
import {
  ClipboardCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  FileQuestion,
  Filter,
} from "lucide-react";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getClaims(statusFilter || undefined, page, 20);
      setClaims(data?.claims || []);
      setTotal(data?.totalClaims || (data?.claims || []).length);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load claims";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

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
      case "approved":
        return <Badge variant="success" dot>Approved</Badge>;
      case "rejected":
        return <Badge variant="error" dot>Rejected</Badge>;
      case "pending":
      default:
        return <Badge variant="warning" dot>Pending Review</Badge>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <Sidebar variant="admin" />
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(6,182,212,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#06B6D4",
              }}
            >
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7" }}>
                Platform Claims Monitor
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>
                {total} total ownership claims filed across the platform
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: "7px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#F5F5F7",
                fontSize: "0.84rem",
                outline: "none",
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={fetchClaims}
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
        <div style={{ flex: 1, padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              background: "rgba(18,20,28,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              overflow: "hidden",
              backdropFilter: "blur(20px)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th style={{ padding: "14px 20px", fontSize: "0.76rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase" }}>
                    Target Found Item
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase" }}>
                    Claimant
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase" }}>
                    Verification Details
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase" }}>
                    Status
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: "0.76rem", fontWeight: 700, color: "#71717A", textTransform: "uppercase", textAlign: "right" }}>
                    Date Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center" }}>
                      <RefreshCw size={24} className="animate-spin" color="#06B6D4" style={{ margin: "0 auto" }} />
                    </td>
                  </tr>
                ) : claims.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#71717A" }}>
                      No claims found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => {
                    const id = claim._id || (claim as any).id;
                    const item = claim.foundItem;
                    const claimant = claim.claimant;

                    return (
                      <tr
                        key={id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          transition: "background 0.15s",
                        }}
                      >
                        {/* Target Found Item */}
                        <td style={{ padding: "16px 20px" }}>
                          <div>
                            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#F5F5F7" }}>
                              {item?.title || "Found Item"}
                            </span>
                            <p style={{ fontSize: "0.75rem", color: "#06B6D4", margin: "2px 0 0" }}>
                              {item?.category || "Category"} • {item?.location || "Location"}
                            </p>
                          </div>
                        </td>

                        {/* Claimant */}
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Avatar src={claimant?.avatar} name={claimant?.name || "Claimant"} size="sm" />
                            <div>
                              <span style={{ fontSize: "0.82rem", color: "#F5F5F7", fontWeight: 500 }}>
                                {claimant?.name || "Unknown"}
                              </span>
                              <p style={{ fontSize: "0.72rem", color: "#71717A", margin: 0 }}>
                                {claimant?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Verification Details */}
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#A1A1AA" }}>
                            <FileQuestion size={13} color="#06B6D4" />
                            <span>{claim.verificationAnswers?.length || 0} answers submitted</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "16px" }}>{getStatusBadge(claim.status)}</td>

                        {/* Date Submitted */}
                        <td style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#A1A1AA", textAlign: "right" }}>
                          {formatDate(claim.createdAt)}
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
