"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import ClaimCard from "@/components/claims/ClaimCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { claimService } from "@/services/claimService";
import { foundItemService } from "@/services/foundItemService";
import { Claim } from "@/types/claim";
import { FoundItem } from "@/types/foundItem";
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function ReviewClaimsPage() {
  const params = useParams();
  const foundItemId = params.id as string;

  const [item, setItem] = useState<FoundItem | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Approval / Rejection modal state
  const [claimToApprove, setClaimToApprove] = useState<Claim | null>(null);
  const [claimToReject, setClaimToReject] = useState<Claim | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchClaimsAndItem = useCallback(async () => {
    try {
      setLoading(true);
      const [itemData, claimsData] = await Promise.all([
        foundItemService.getFoundItemById(foundItemId),
        claimService.getClaimsForFoundItem(foundItemId),
      ]);

      setItem(itemData?.item || null);
      setClaims(claimsData?.claims || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load claims for item";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [foundItemId]);

  useEffect(() => {
    if (foundItemId) fetchClaimsAndItem();
  }, [foundItemId, fetchClaimsAndItem]);

  const handleApprove = async () => {
    if (!claimToApprove) return;
    try {
      setIsProcessing(true);
      await claimService.approveClaim(claimToApprove._id || (claimToApprove as any).id);
      setToast({
        type: "success",
        message: `Claim for ${claimToApprove.claimant?.name} approved! Other pending claims auto-rejected.`,
      });
      setClaimToApprove(null);
      fetchClaimsAndItem();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to approve claim";
      setToast({ type: "error", message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!claimToReject) return;
    try {
      setIsProcessing(true);
      await claimService.rejectClaim(claimToReject._id || (claimToReject as any).id);
      setToast({
        type: "info",
        message: `Claim for ${claimToReject.claimant?.name} rejected.`,
      });
      setClaimToReject(null);
      fetchClaimsAndItem();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to reject claim";
      setToast({ type: "error", message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <Sidebar variant="user" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(claimToApprove)}
        title="Approve Ownership Claim"
        message={`Are you sure you want to verify and approve the claim by ${claimToApprove?.claimant?.name}? All other competing claims will be automatically rejected.`}
        confirmText="Approve Claim"
        variant="primary"
        isLoading={isProcessing}
        onConfirm={handleApprove}
        onCancel={() => setClaimToApprove(null)}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(claimToReject)}
        title="Reject Ownership Claim"
        message={`Are you sure you want to reject the claim by ${claimToReject?.claimant?.name}?`}
        confirmText="Reject Claim"
        variant="danger"
        isLoading={isProcessing}
        onConfirm={handleReject}
        onCancel={() => setClaimToReject(null)}
      />

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
            <Link
              href="/dashboard/found-items"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#A1A1AA",
                fontSize: "0.82rem",
                textDecoration: "none",
                marginRight: "8px",
              }}
            >
              <ArrowLeft size={14} /> My Found Items
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "rgba(6,182,212,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#06B6D4",
                }}
              >
                <Users size={15} />
              </div>
              <h1 style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F7" }}>
                Review Claims ({claims.length})
              </h1>
            </div>
          </div>

          <button
            onClick={fetchClaimsAndItem}
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
          {/* Found Item Summary */}
          {item && (
            <div
              style={{
                background: "rgba(18,20,28,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "18px 20px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#06B6D4", textTransform: "uppercase" }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F5F5F7", margin: "2px 0 4px" }}>
                  {item.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.78rem", color: "#A1A1AA" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={12} color="#60A5FA" /> {item.location}
                  </span>
                </div>
              </div>

              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  background: item.status === "claimed" ? "rgba(34,197,94,0.15)" : "rgba(6,182,212,0.15)",
                  color: item.status === "claimed" ? "#4ADE80" : "#22D3EE",
                  border: `1px solid ${item.status === "claimed" ? "rgba(34,197,94,0.3)" : "rgba(6,182,212,0.3)"}`,
                }}
              >
                Status: {item.status.toUpperCase()}
              </span>
            </div>
          )}

          {/* Claims List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[1, 2].map((n) => (
                <div key={n} style={{ height: "140px", borderRadius: "18px" }} className="skeleton" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                background: "rgba(18,20,28,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "rgba(6,182,212,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#06B6D4",
                  margin: "0 auto 14px",
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F5F5F7", marginBottom: "4px" }}>
                No claims filed yet
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#A1A1AA", maxWidth: "360px", margin: "0 auto" }}>
                When users file ownership verification claims for this item, they will appear here for your review.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {claims.map((c) => (
                <ClaimCard
                  key={c._id || (c as any).id}
                  claim={c}
                  perspective="finder"
                  onApprove={(claim) => setClaimToApprove(claim)}
                  onReject={(claim) => setClaimToReject(claim)}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
