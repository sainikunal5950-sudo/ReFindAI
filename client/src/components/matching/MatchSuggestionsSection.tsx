"use client";

import React, { useState, useEffect, useCallback } from "react";
import MatchCard from "./MatchCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { matchService } from "@/services/matchService";
import { Match } from "@/types/match";
import { Sparkles, Bell, RefreshCw } from "lucide-react";

interface MatchSuggestionsSectionProps {
  itemId: string;
  itemType: "lost" | "found";
  onMatchConfirmed?: (match: Match) => void;
}

export default function MatchSuggestionsSection({
  itemId,
  itemType,
  onMatchConfirmed,
}: MatchSuggestionsSectionProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [matchToConfirm, setMatchToConfirm] = useState<Match | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data =
        itemType === "lost"
          ? await matchService.getMatchesForLostItem(itemId)
          : await matchService.getMatchesForFoundItem(itemId);

      // Filter out rejected matches by default
      setMatches((data?.matches || []).filter((m) => m.status !== "rejected"));
    } catch (err: any) {
      console.warn("Could not load matches:", err.message);
    } finally {
      setLoading(false);
    }
  }, [itemId, itemType]);

  useEffect(() => {
    if (itemId) fetchMatches();
  }, [itemId, fetchMatches]);

  const handleConfirmAction = async () => {
    if (!matchToConfirm) return;
    try {
      setIsConfirming(true);
      const res = await matchService.confirmMatch(matchToConfirm._id || (matchToConfirm as any).id);
      setToast({
        type: "success",
        message: "Match confirmed successfully! Redirecting to claim verification...",
      });

      // Update state locally
      setMatches((prev) =>
        prev.map((m) => (m._id === matchToConfirm._id ? { ...m, status: "confirmed" } : m))
      );

      if (onMatchConfirmed) {
        onMatchConfirmed(res.match);
      }
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={Boolean(matchToConfirm)}
        title="Confirm Match Suggestion"
        message={`Are you sure you want to confirm this match (${matchToConfirm?.matchScore}% match score)? This will notify both parties and initiate the return verification.`}
        confirmText="Confirm & Connect"
        variant="primary"
        isLoading={isConfirming}
        onConfirm={handleConfirmAction}
        onCancel={() => setMatchToConfirm(null)}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "#FDF4D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#92700F",
            }}
          >
            <Sparkles size={15} />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.01em" }}>
              AI Match Suggestions
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#6B6B6B" }}>
              Ranked by cross-attribute similarity engine
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchMatches}
          disabled={loading}
          style={{
            padding: "6px 12px",
            background: "#F9FAFB",
            border: "1px solid #F9FAFB",
            borderRadius: "8px",
            color: "#6B6B6B",
            fontSize: "0.78rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        /* Skeletons */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2].map((n) => (
            <div
              key={n}
              style={{
                height: "120px",
                borderRadius: "18px",
                background: "#FFFFFF",
                border: "1px solid #F9FAFB",
              }}
              className="skeleton"
            />
          ))}
        </div>
      ) : matches.length === 0 ? (
        /* Empty State */
        <div
          style={{
            padding: "36px 20px",
            background: "#FFFFFF",
            border: "1px solid #F9FAFB",
            borderRadius: "18px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#FDF4D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4AF37",
            }}
          >
            <Bell size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>
              No matches found yet
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#6B6B6B", maxWidth: "340px", margin: "0 auto", lineHeight: 1.4 }}>
              Our AI engine is continuously cross-referencing incoming reports. We&apos;ll notify you the moment a match is found!
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {matches.map((m) => (
            <MatchCard
              key={m._id || (m as any).id}
              match={m}
              perspective={itemType}
              onConfirm={(match) => setMatchToConfirm(match)}
              onReject={handleRejectAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
