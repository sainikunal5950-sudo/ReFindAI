"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import ClaimCard from "@/components/claims/ClaimCard";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { claimService } from "@/services/claimService";
import { Claim } from "@/types/claim";
import {
  ClipboardCheck,
  PackageSearch,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

export default function MyClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const data = await claimService.getMyClaims();
      setClaims(data?.claims || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load claims";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

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
                My Submitted Claims
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>
                {claims.length} verification claims filed by you
              </p>
            </div>
          </div>

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
        </header>

        {/* Body Content */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
          {loading ? (
            /* Skeletons */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2].map((n) => (
                <div key={n} style={{ height: "140px", borderRadius: "18px" }} className="skeleton" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            /* Empty State */
            <div
              style={{
                padding: "72px 20px",
                background: "rgba(18,20,28,0.6)",
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
                  background: "rgba(6,182,212,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#06B6D4",
                  margin: "0 auto 16px",
                }}
              >
                <PackageSearch size={30} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F5F5F7", marginBottom: "6px" }}>
                No claims submitted yet
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#A1A1AA", marginBottom: "24px", lineHeight: 1.5 }}>
                Browse recently found items to file an ownership verification claim if you recognize your lost property.
              </p>
              <Link
                href="/found"
                style={{
                  padding: "12px 22px",
                  background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px rgba(6,182,212,0.35)",
                }}
              >
                <PackageSearch size={16} /> Browse Found Items
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {claims.map((c) => (
                <ClaimCard key={c._id || (c as any).id} claim={c} perspective="claimant" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
