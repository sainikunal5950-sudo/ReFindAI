"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { foundItemService } from "@/services/foundItemService";
import { claimService } from "@/services/claimService";
import { authService } from "@/services/authService";
import { FoundItem } from "@/types/foundItem";
import { Claim } from "@/types/claim";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  Building,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const DEFAULT_QUESTIONS = [
  "What are the distinguishing marks, scratches, stickers, or serial details on this item?",
  "What are the exact colors, case/accessories, or interior contents?",
  "Where and approximately when did you lose this item?",
];

export default function SubmitClaimPage() {
  const params = useParams();
  const router = useRouter();
  const foundItemId = params.id as string;

  const [item, setItem] = useState<FoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [createdClaim, setCreatedClaim] = useState<Claim | null>(null);

  // Verification Q&A state
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [proofMessage, setProofMessage] = useState("");

  useEffect(() => {
    if (foundItemId) fetchItem();
  }, [foundItemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await foundItemService.getFoundItemById(foundItemId);
      if (data?.item) {
        setItem(data.item);
        const qList =
          (data.item as any).verificationQuestions && (data.item as any).verificationQuestions.length > 0
            ? (data.item as any).verificationQuestions
            : DEFAULT_QUESTIONS;
        setQuestions(qList);
        setAnswers(new Array(qList.length).fill(""));
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load item details";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index: number, val: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const isFormValid = () => {
    return answers.length > 0 && answers.every((a) => a.trim().length >= 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = authService.getToken();
    if (!token) {
      setToast({ type: "error", message: "Please log in to submit a verification claim." });
      setTimeout(() => router.push("/login"), 1800);
      return;
    }

    if (!isFormValid()) {
      setToast({ type: "error", message: "Please answer all verification questions (min 3 characters each)." });
      return;
    }

    try {
      setSubmitting(true);
      const verificationAnswers = questions.map((q, idx) => ({
        question: q,
        answer: answers[idx].trim(),
      }));

      const res = await claimService.submitClaim({
        foundItemId,
        verificationAnswers,
        proofMessage: proofMessage.trim(),
      });

      if (res?.claim) {
        setCreatedClaim(res.claim);
        setToast({ type: "success", message: "Your claim has been submitted for finder review!" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit ownership claim";
      setToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const getFullImageUrl = (imgPath?: string) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${backendUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F5F5F7" }}>
      <Navbar />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "88px 24px 80px" }}>
        {/* Back Link */}
        <Link
          href={`/found/${foundItemId}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#A1A1AA",
            fontSize: "0.88rem",
            textDecoration: "none",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={16} /> Back to Item Details
        </Link>

        {/* Confirmation Screen */}
        {createdClaim ? (
          <div
            style={{
              background: "rgba(18,20,28,0.9)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "24px",
              padding: "48px 36px",
              textAlign: "center",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 80px rgba(34,197,94,0.15)",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(34,197,94,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4ADE80",
                margin: "0 auto 20px",
                border: "2px solid rgba(34,197,94,0.4)",
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#F5F5F7", marginBottom: "8px" }}>
              Claim Submitted for Review!
            </h1>
            <p style={{ color: "#A1A1AA", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 32px" }}>
              Your verification answers have been sent to the finder. You will be notified the moment your claim is verified.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/dashboard/claims"
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(6,182,212,0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Track in My Claims <ArrowRight size={16} />
              </Link>
              <Link
                href="/found"
                style={{
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#A1A1AA",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  textDecoration: "none",
                }}
              >
                Browse Found Items
              </Link>
            </div>
          </div>
        ) : (
          /* Main Claim Form Container */
          <div
            style={{
              background: "rgba(18,20,28,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "36px",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#06B6D4", textTransform: "uppercase" }}>
                  Ownership Verification
                </span>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#06B6D4" }} />
                <span style={{ fontSize: "0.75rem", color: "#A1A1AA" }}>Step 1 of 1</span>
              </div>
              <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2rem)", fontWeight: 800, color: "#F5F5F7" }}>
                Claim This{" "}
                <span style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Found Item
                </span>
              </h1>
              <p style={{ color: "#A1A1AA", fontSize: "0.9rem", marginTop: "6px" }}>
                Please answer the following verification questions to prove your ownership to the finder.
              </p>
            </div>

            {/* Item Summary Card */}
            {item && (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: "rgba(6,182,212,0.1)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={getFullImageUrl(item.images[0])}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ShieldCheck size={24} color="#06B6D4" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#06B6D4", textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F7", margin: "2px 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#A1A1AA", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={12} color="#60A5FA" /> {item.location}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Questions Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {questions.map((q, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F5F5F7", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ color: "#06B6D4", fontWeight: 700 }}>{idx + 1}.</span> {q}
                    </label>
                    <textarea
                      rows={2}
                      value={answers[idx] || ""}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      placeholder="Provide precise details (e.g. engravings, stickers, exact color, lockscreen pattern...)"
                      style={{
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#F5F5F7",
                        fontSize: "0.9rem",
                        outline: "none",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#06B6D4")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                ))}

                {/* Additional Proof Message */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#A1A1AA" }}>
                    Additional Proof / Message to Finder (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={proofMessage}
                    onChange={(e) => setProofMessage(e.target.value)}
                    placeholder="Mention if you have original box, serial receipt, photos, or preferred pickup time..."
                    style={{
                      padding: "12px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#F5F5F7",
                      fontSize: "0.9rem",
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting || !isFormValid()}
                style={{
                  width: "100%",
                  padding: "16px",
                  background:
                    submitting || !isFormValid()
                      ? "rgba(6,182,212,0.3)"
                      : "linear-gradient(135deg, #06B6D4, #3B82F6)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: submitting || !isFormValid() ? "not-allowed" : "pointer",
                  boxShadow: isFormValid() ? "0 8px 30px rgba(6,182,212,0.4)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
              >
                {submitting ? "Submitting Verification..." : "Submit Claim for Verification"}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
