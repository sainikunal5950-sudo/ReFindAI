"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ImageUploader from "@/components/items/ImageUploader";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { lostItemService } from "@/services/lostItemService";
import { authService } from "@/services/authService";
import { LostItem } from "@/types/lostItem";
import {
  FilePlus,
  Tag,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Info,
  Layers,
  ChevronDown,
} from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Bags",
  "Jewelry",
  "Clothing",
  "Keys",
  "Others",
];

export default function ReportLostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [createdItem, setCreatedItem] = useState<LostItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [images, setImages] = useState<File[]>([]);

  // Validation Errors
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    location?: string;
    date?: string;
  }>({});

  const validateForm = () => {
    const errs: typeof errors = {};

    if (!title.trim() || title.trim().length < 3) {
      errs.title = "Title is required (minimum 3 characters)";
    }

    if (!description.trim() || description.trim().length < 10) {
      errs.description = "Please provide more details (minimum 10 characters)";
    }

    if (!location.trim() || location.trim().length < 2) {
      errs.location = "Location is required (where you lost it)";
    }

    if (!date) {
      errs.date = "Date of loss is required";
    } else {
      const selected = new Date(date);
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (selected > tomorrow) {
        errs.date = "Date cannot be in the future";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    const token = authService.getToken();
    if (!token) {
      setToast({
        type: "error",
        message: "Please log in or create an account to post a lost item report.",
      });
      setTimeout(() => router.push("/login"), 1800);
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await lostItemService.createLostItem({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        date,
        images,
      });

      if (res?.item) {
        setCreatedItem(res.item);
        setToast({
          type: "success",
          message: "Your lost item report has been published successfully!",
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit lost item report";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Electronics");
    setLocation("");
    setDate(new Date().toISOString().split("T")[0]);
    setImages([]);
    setErrors({});
    setCreatedItem(null);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A" }}>
      <Navbar />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "88px 24px 80px" }}>
        {/* Success Confirmation Screen */}
        {createdItem ? (
          <div
            style={{
              background: "#FFFFFF",
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

            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1A1A1A", marginBottom: "8px" }}>
              Report Published Successfully!
            </h1>
            <p style={{ color: "#6B6B6B", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 32px" }}>
              Our AI engine is now actively scanning newly found items in real-time to find matches for your item.
            </p>

            {/* Quick Preview Card */}
            <div
              style={{
                maxWidth: "400px",
                margin: "0 auto 36px",
                padding: "20px",
                background: "#F9FAFB",
                border: "1px solid #F9FAFB",
                borderRadius: "16px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#D4AF37", textTransform: "uppercase" }}>
                {createdItem.category}
              </span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1A1A1A", margin: "4px 0 8px" }}>
                {createdItem.title}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#6B6B6B", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={13} color="#F5C842" /> {createdItem.location}
              </p>
            </div>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/lost/${createdItem._id || createdItem.id}`}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px #F5E5B8",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                View Report <ArrowRight size={16} />
              </Link>
              <button
                onClick={resetForm}
                style={{
                  padding: "12px 24px",
                  background: "#F9FAFB",
                  border: "1px solid #F3F4F6",
                  borderRadius: "12px",
                  color: "#6B6B6B",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                }}
              >
                Report Another Item
              </button>
            </div>
          </div>
        ) : (
          /* Form Container */
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F9FAFB",
              borderRadius: "24px",
              padding: "44px 36px",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212, 175, 55,0.06)",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "32px", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#D4AF37", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Lost Item Form
                </span>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D4AF37" }} />
                <span style={{ fontSize: "0.75rem", color: "#6B6B6B" }}>Step 1 of 1</span>
              </div>
              <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "#1A1A1A" }}>
                Report a{" "}
                <span style={{ background: "linear-gradient(135deg, #D4AF37, #F5C842)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Lost Item
                </span>
              </h1>
              <p style={{ color: "#6B6B6B", fontSize: "0.92rem", marginTop: "6px" }}>
                Fill in the details below. Our AI matching system will immediately cross-reference incoming found reports.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* SECTION 1: Item Information */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F9FAFB", paddingBottom: "8px" }}>
                  <Layers size={16} color="#D4AF37" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#92700F", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    1. Item Information
                  </span>
                </div>

                {/* Title */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B6B6B" }}>
                    Item Title <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: undefined });
                    }}
                    placeholder="e.g. Space Gray iPhone 13 Pro in Blue Case"
                    style={{
                      padding: "12px 16px",
                      background: "#F9FAFB",
                      border: `1px solid ${errors.title ? "#EF4444" : "#F3F4F6"}`,
                      borderRadius: "10px",
                      color: "#1A1A1A",
                      fontSize: "0.95rem",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      if (!errors.title) e.currentTarget.style.borderColor = "#D4AF37";
                    }}
                    onBlur={(e) => {
                      if (!errors.title) e.currentTarget.style.borderColor = "#F3F4F6";
                    }}
                  />
                  {errors.title && <span style={{ fontSize: "0.75rem", color: "#EF4444" }}>{errors.title}</span>}
                </div>

                {/* Category Dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B6B6B" }}>
                    Category <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 38px 12px 16px",
                        background: "#F9FAFB",
                        border: "1px solid #F3F4F6",
                        borderRadius: "10px",
                        color: "#1A1A1A",
                        fontSize: "0.95rem",
                        outline: "none",
                        appearance: "none",
                        fontFamily: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} style={{ background: "#FFFFFF" }}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      color="#606070"
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B6B6B" }}>
                    Detailed Description <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) setErrors({ ...errors, description: undefined });
                    }}
                    placeholder="Describe distinguishing marks, serial numbers, stickers, scratches, case color, lock screen wallpaper..."
                    style={{
                      padding: "12px 16px",
                      background: "#F9FAFB",
                      border: `1px solid ${errors.description ? "#EF4444" : "#F3F4F6"}`,
                      borderRadius: "10px",
                      color: "#1A1A1A",
                      fontSize: "0.92rem",
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "vertical",
                      lineHeight: 1.5,
                    }}
                    onFocus={(e) => {
                      if (!errors.description) e.currentTarget.style.borderColor = "#D4AF37";
                    }}
                    onBlur={(e) => {
                      if (!errors.description) e.currentTarget.style.borderColor = "#F3F4F6";
                    }}
                  />
                  {errors.description && (
                    <span style={{ fontSize: "0.75rem", color: "#EF4444" }}>{errors.description}</span>
                  )}
                </div>
              </div>

              {/* SECTION 2: Location & Date */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F9FAFB", paddingBottom: "8px" }}>
                  <MapPin size={16} color="#F5C842" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#92700F", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    2. Location & Date
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Location */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B6B6B" }}>
                      Where was it lost? <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (errors.location) setErrors({ ...errors, location: undefined });
                      }}
                      placeholder="e.g. JFK Airport Terminal 4, NY"
                      style={{
                        padding: "12px 16px",
                        background: "#F9FAFB",
                        border: `1px solid ${errors.location ? "#EF4444" : "#F3F4F6"}`,
                        borderRadius: "10px",
                        color: "#1A1A1A",
                        fontSize: "0.92rem",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                    {errors.location && (
                      <span style={{ fontSize: "0.75rem", color: "#EF4444" }}>{errors.location}</span>
                    )}
                  </div>

                  {/* Date */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B6B6B" }}>
                      When was it lost? <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: undefined });
                      }}
                      style={{
                        padding: "12px 16px",
                        background: "#F9FAFB",
                        border: `1px solid ${errors.date ? "#EF4444" : "#F3F4F6"}`,
                        borderRadius: "10px",
                        color: "#1A1A1A",
                        fontSize: "0.92rem",
                        outline: "none",
                        fontFamily: "inherit",
                        colorScheme: "dark",
                      }}
                    />
                    {errors.date && <span style={{ fontSize: "0.75rem", color: "#EF4444" }}>{errors.date}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Photos */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F9FAFB", paddingBottom: "8px" }}>
                  <Sparkles size={16} color="#A855F7" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#C084FC", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    3. Photos (Optional, Recommended)
                  </span>
                </div>

                <ImageUploader images={images} onChange={setImages} maxFiles={5} />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: loading
                    ? "rgba(212, 175, 55,0.4)"
                    : "linear-gradient(135deg, #D4AF37, #F5C842)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 8px 30px rgba(212, 175, 55,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.25s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Publishing Report...
                  </>
                ) : (
                  <>
                    <FilePlus size={18} />
                    Submit Lost Item Report
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
