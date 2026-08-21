"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import ScoreRing from "@/components/matching/ScoreRing";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { adminService } from "@/services/adminService";
import { Match } from "@/types/match";
import {
  GitCompare,
  RefreshCw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getMatches(statusFilter || undefined, page, 20);
      setMatches(data?.matches || []);
      setTotal(data?.total || (data?.matches || []).length);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load matches";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

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
      case "confirmed":
        return <Badge variant="success" dot>Confirmed Match</Badge>;
      case "rejected":
        return <Badge variant="error" dot>Dismissed</Badge>;
      case "pending":
      default:
        return <Badge variant="blue" dot>Suggested</Badge>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <Sidebar variant="admin" />
      <Toast toast={toast} onClose={() => setToast(null)} />

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
                background: "rgba(168,85,247,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C084FC",
              }}
            >
              <GitCompare size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" }}>
                AI Matches Overview
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>
                {total} potential and confirmed AI match pairs platform-wide
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
                background: "#F9FAFB",
                border: "1px solid #F9FAFB",
                borderRadius: "10px",
                color: "#1A1A1A",
                fontSize: "0.84rem",
                outline: "none",
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Suggestions</option>
              <option value="confirmed">Confirmed Matches</option>
              <option value="rejected">Dismissed</option>
            </select>

            <button
              onClick={fetchMatches}
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
          </div>
        </header>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
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
                    Lost Item (Reported)
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Found Item (Discovered)
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    AI Score
                  </th>
                  <th style={{ padding: "14px 16px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
                    Match Status
                  </th>
                  <th style={{ padding: "14px 20px", fontSize: "0.76rem", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase", textAlign: "right" }}>
                    Date Generated
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center" }}>
                      <RefreshCw size={24} className="animate-spin" color="#C084FC" style={{ margin: "0 auto" }} />
                    </td>
                  </tr>
                ) : matches.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#8E8E93" }}>
                      No AI matches generated matching criteria.
                    </td>
                  </tr>
                ) : (
                  matches.map((match) => {
                    const id = match._id || (match as any).id;
                    const lost = match.lostItem;
                    const found = match.foundItem;

                    return (
                      <tr
                        key={id}
                        style={{
                          borderBottom: "1px solid #F9FAFB",
                          transition: "background 0.15s",
                        }}
                      >
                        {/* Lost Item */}
                        <td style={{ padding: "16px 20px" }}>
                          <div>
                            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1A1A1A" }}>
                              {lost?.title || "Lost Item"}
                            </span>
                            <p style={{ fontSize: "0.74rem", color: "#92700F", margin: "2px 0 0" }}>
                              {lost?.category} • {lost?.location}
                            </p>
                          </div>
                        </td>

                        {/* Found Item */}
                        <td style={{ padding: "16px" }}>
                          <div>
                            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1A1A1A" }}>
                              {found?.title || "Found Item"}
                            </span>
                            <p style={{ fontSize: "0.74rem", color: "#92700F", margin: "2px 0 0" }}>
                              {found?.category} • {found?.location}
                            </p>
                          </div>
                        </td>

                        {/* AI Score */}
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <ScoreRing score={match.matchScore} size={36} strokeWidth={3.5} />
                            <span
                              style={{
                                fontSize: "0.86rem",
                                fontWeight: 800,
                                color: match.matchScore >= 80 ? "#4ADE80" : match.matchScore >= 60 ? "#FDE047" : "#FCD34D",
                              }}
                            >
                              {match.matchScore}%
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "16px" }}>{getStatusBadge(match.status)}</td>

                        {/* Date Generated */}
                        <td style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#6B6B6B", textAlign: "right" }}>
                          {formatDate(match.createdAt)}
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
