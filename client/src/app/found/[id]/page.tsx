"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { foundItemService } from "@/services/foundItemService";
import { authService } from "@/services/authService";
import { FoundItem } from "@/types/foundItem";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Share2,
  Trash2,
  Sparkles,
  Shield,
  Building,
  HandMetal,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function FoundItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<FoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Current logged-in user
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (itemId) fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await foundItemService.getFoundItemById(itemId);
      if (data?.item) {
        setItem(data.item);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load found item details";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const isOwnerOrAdmin =
    currentUser &&
    item &&
    ((item.user?._id && currentUser._id === item.user._id) ||
      (item.user?.id && currentUser.id === item.user.id) ||
      currentUser.role === "admin");

  const handleDelete = async () => {
    if (!item) return;
    try {
      setIsDeleting(true);
      await foundItemService.deleteFoundItem(item._id || (item as any).id);
      setToast({ type: "success", message: "Found item report deleted successfully" });
      setTimeout(() => router.push("/found"), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete item report";
      setToast({ type: "error", message: msg });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: `Found: ${item?.title} in ${item?.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({ type: "info", message: "Link copied to clipboard!" });
    }
  };

  const handleInitiateClaim = () => {
    const token = authService.getToken();
    if (!token) {
      setToast({ type: "error", message: "Please log in to submit a verification claim." });
      setTimeout(() => router.push("/login"), 1800);
      return;
    }
    setShowClaimModal(true);
  };

  const getFullImageUrl = (imgPath?: string) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${backendUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "matched":
        return <Badge variant="cyan" dot>Matched with Lost Report</Badge>;
      case "claimed":
        return <Badge variant="success" dot>Claimed / Returned</Badge>;
      case "closed":
        return <Badge variant="neutral">Closed</Badge>;
      case "active":
      default:
        return <Badge variant="blue" dot>Awaiting Owner Claim</Badge>;
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F5F5F7" }}>
      <Navbar />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Found Item Report"
        message={`Are you sure you want to permanently remove "${item?.title}"?`}
        confirmText="Delete Report"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Claim Prompt Modal */}
      {showClaimModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClaimModal(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "rgba(18,20,28,0.95)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(6,182,212,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#06B6D4",
                margin: "0 auto 16px",
              }}
            >
              <HandMetal size={28} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#F5F5F7", marginBottom: "8px" }}>
              Claim Verification
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#A1A1AA", lineHeight: 1.5, marginBottom: "24px" }}>
              To verify that this <strong>{item?.title}</strong> belongs to you, you will be prompted to answer specific verification questions and submit proof of ownership in the upcoming Claims module.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowClaimModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#A1A1AA",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setToast({ type: "success", message: "Claim intent recorded for Module 7!" });
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(6,182,212,0.4)",
                }}
              >
                Start Verification
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "88px 24px 80px" }}>
        {/* Back Link & Actions Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <Link
            href="/found"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#A1A1AA",
              fontSize: "0.88rem",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F7")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#A1A1AA")}
          >
            <ArrowLeft size={16} /> Back to Found Items
          </Link>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleShare}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#A1A1AA",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <Share2 size={14} /> Share
            </button>

            {isOwnerOrAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "10px",
                  color: "#F87171",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </div>

        {loading ? (
          /* Skeleton Loader */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div style={{ height: "420px", borderRadius: "24px" }} className="skeleton" />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ height: "32px", width: "40%" }} className="skeleton" />
              <div style={{ height: "48px" }} className="skeleton" />
              <div style={{ height: "120px" }} className="skeleton" />
            </div>
          </div>
        ) : !item ? (
          /* Not Found State */
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "8px" }}>Found Item Not Found</h2>
            <p style={{ color: "#A1A1AA", marginBottom: "20px" }}>
              The requested found item report does not exist or has been resolved.
            </p>
            <Link
              href="/found"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Browse Found Items
            </Link>
          </div>
        ) : (
          /* Main Found Item Details Grid */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "36px", alignItems: "flex-start" }}>
            {/* Left Column: Gallery */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Primary Image Display */}
              <div
                style={{
                  width: "100%",
                  height: "380px",
                  borderRadius: "24px",
                  background: "rgba(18,20,28,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {item.images && item.images.length > 0 ? (
                  <img
                    src={getFullImageUrl(item.images[selectedImageIndex] || item.images[0])}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      background: "#08090C",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "24px",
                      background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                      opacity: 0.8,
                      boxShadow: "0 12px 36px rgba(6,182,212,0.4)",
                    }}
                  />
                )}
              </div>

              {/* Thumbnail Gallery (if multiple images) */}
              {item.images && item.images.length > 1 && (
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
                  {item.images.map((img, idx) => {
                    const isSelected = idx === selectedImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: isSelected ? "2px solid #06B6D4" : "1px solid rgba(255,255,255,0.1)",
                          background: "#12141C",
                          padding: 0,
                          cursor: "pointer",
                          boxShadow: isSelected ? "0 0 14px rgba(6,182,212,0.4)" : "none",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={getFullImageUrl(img)}
                          alt={`Thumbnail ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Metadata & Claim CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Header Badges & Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <Badge variant="cyan">{item.category}</Badge>
                  {getStatusBadge(item.status)}
                </div>

                <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 800, color: "#F5F5F7", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                  {item.title}
                </h1>
              </div>

              {/* Claim This Item Action Button */}
              {item.status === "active" && (
                <button
                  type="button"
                  onClick={handleInitiateClaim}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                    border: "none",
                    borderRadius: "14px",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 30px rgba(6,182,212,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <HandMetal size={20} /> Claim This Item
                </button>
              )}

              {/* Location, Handover & Date Highlights */}
              <div
                style={{
                  background: "rgba(18,20,28,0.8)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  display: "grid",
                  gridTemplateColumns: item.handoverLocation ? "1fr 1fr" : "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(6,182,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4", flexShrink: 0 }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location Found</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#F5F5F7" }}>{item.location}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date Found</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#F5F5F7" }}>{formatDate(item.date)}</div>
                  </div>
                </div>

                {item.handoverLocation && (
                  <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", gap: "10px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A855F7", flexShrink: 0 }}>
                      <Building size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Handover / Drop-off Point</div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#F5F5F7" }}>{item.handoverLocation}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div>
                <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  Description
                </h3>
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    color: "#F5F5F7",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.description}
                </div>
              </div>

              {/* Finder Info (Privacy Protected) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(18,20,28,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar src={item.user?.avatar} name={item.user?.name || "Good Samaritan"} size="sm" glow={false} />
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F5F5F7", display: "block" }}>
                      Turned in by {item.user?.name ? item.user.name.split(" ")[0] : "Good Samaritan"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#606070" }}>
                      Listed on {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: "0.75rem", color: "#06B6D4", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Shield size={13} /> Verified Finder
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
