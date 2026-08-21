"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import MatchCard from "@/components/matching/MatchCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { matchService } from "@/services/matchService";
import { Match } from "@/types/match";
import {
  GitCompare,
  Sparkles,
  RefreshCw,
  Bell,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function MyMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [matchToConfirm, setMatchToConfirm] = useState<Match | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await matchService.getMyMatches();
      setMatches(data?.matches || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load matches";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleConfirmAction = async () => {
    if (!matchToConfirm) return;
    try {
      setIsConfirming(true);
      await matchService.confirmMatch(matchToConfirm._id || (matchToConfirm as any).id);
      setToast({
        type: "success",
        message: "Match confirmed! Both parties have been notified.",
      });

      setMatches((prev) =>
        prev.map((m) => (m._id === matchToConfirm._id ? { ...m, status: "confirmed" } : m))
      );
      setMatchToConfirm(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to confirm match";
      setToast({ type: "error", message: msg });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRejectAction = async (match: Match) => {
    try {
      await matchService.rejectMatch(match._id || (match as any).id);
      setMatches((prev) => prev.filter((m) => m._id !== match._id));
      setToast({ type: "info", message: "Match suggestion dismissed." });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to dismiss match";
      setToast({ type: "error", message: msg });
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (statusFilter === "all") return m.status !== "rejected";
    return m.status === statusFilter;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1E1425" }}>
      <Sidebar variant="user" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={Boolean(matchToConfirm)}
        title="Confirm Match Suggestion"
        message={`Are you sure you want to confirm this match (${matchToConfirm?.matchScore}% match score)? This will lock in the connection and proceed to claim verification.`}
        confirmText="Confirm & Connect"
        variant="primary"
        isLoading={isConfirming}
        onConfirm={handleConfirmAction}
        onCancel={() => setMatchToConfirm(null)}
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
                background: "linear-gradient(135deg, rgba(212, 175, 55,0.2), rgba(245, 200, 66,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F5C842",
              }}
            >
              <GitCompare size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F8F5F0" }}>
                AI Match Suggestions
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#B8AEC2" }}>
                {filteredMatches.length} potential matches for your reported items
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#F8F5F0",
                fontSize: "0.82rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all" style={{ background: "#150E1C" }}>All Active Matches</option>
              <option value="pending" style={{ background: "#150E1C" }}>Pending Review</option>
              <option value="confirmed" style={{ background: "#150E1C" }}>Confirmed Matches</option>
            </select>

            <button
              onClick={fetchMatches}
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
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "960px", margin: "0 auto", width: "100%" }}>
          {loading ? (
            /* Skeleton Loading Grid */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ height: "130px", borderRadius: "20px" }} className="skeleton" />
              ))}
            </div>
          ) : filteredMatches.length === 0 ? (
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
                  background: "rgba(212, 175, 55,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D4AF37",
                  margin: "0 auto 16px",
                }}
              >
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F8F5F0", marginBottom: "6px" }}>
                No active matches found
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#B8AEC2", marginBottom: "24px", lineHeight: 1.5 }}>
                Our AI matching algorithm is actively scanning newly posted items. When an item matching your title, category, location, and date is reported, it will appear here immediately.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Link
                  href="/lost/report"
                  style={{
                    padding: "10px 18px",
                    background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Report Lost Item
                </Link>
                <Link
                  href="/found/report"
                  style={{
                    padding: "10px 18px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#F8F5F0",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Report Found Item
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredMatches.map((m) => (
                <MatchCard
                  key={m._id || (m as any).id}
                  match={m}
                  perspective="lost"
                  onConfirm={(match) => setMatchToConfirm(match)}
                  onReject={handleRejectAction}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
