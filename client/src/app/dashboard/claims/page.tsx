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
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <Sidebar variant="user" />
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
                color: "#92700F",
              }}
            >
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" }}>
                My Submitted Claims
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>
                {claims.length} verification claims filed by you
              </p>
            </div>
          </div>

          <button
            onClick={fetchClaims}
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
                  background: "rgba(245, 200, 66,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#92700F",
                  margin: "0 auto 16px",
                }}
              >
                <PackageSearch size={30} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "6px" }}>
                No claims submitted yet
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#6B6B6B", marginBottom: "24px", lineHeight: 1.5 }}>
                Browse recently found items to file an ownership verification claim if you recognize your lost property.
              </p>
              <Link
                href="/found"
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
