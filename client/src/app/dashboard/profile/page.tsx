"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import { User } from "@/types/user";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Save,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      if (data?.user) {
        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
        setAddress(data.user.address || "");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load user profile";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name cannot be empty";
    }

    if (phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
      if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = "Please enter a valid phone number (e.g. +1 555 123 4567)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const res = await userService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      if (res?.user) {
        setUser(res.user);
        // Also update stored local user
        const localUser = authService.getCurrentUser();
        if (localUser) {
          localStorage.setItem(
            "retrivo_user",
            JSON.stringify({ ...localUser, ...res.user })
          );
        }
        setToast({ type: "success", message: "Profile updated successfully!" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile";
      setToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      const res = await userService.uploadAvatar(file);
      if (res?.user) {
        setUser(res.user);
        const localUser = authService.getCurrentUser();
        if (localUser) {
          localStorage.setItem(
            "retrivo_user",
            JSON.stringify({ ...localUser, avatar: res.user.avatar })
          );
        }
        setToast({ type: "success", message: "Avatar uploaded successfully!" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to upload avatar";
      setToast({ type: "error", message: msg });
    } finally {
      setUploadingAvatar(false);
    }
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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1E1425" }}>
      <Sidebar variant={user?.role === "admin" ? "admin" : "user"} />
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
            background: "rgba(21, 14, 28,0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F8F5F0" }}>My Profile</h1>
            <p style={{ fontSize: "0.78rem", color: "#B8AEC2" }}>Manage your account settings & preferences</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Badge variant={user?.role === "admin" ? "blue" : "neutral"}>
              {user?.role?.toUpperCase() || "USER"}
            </Badge>
          </div>
        </header>

        {/* Body Container */}
        <div
          style={{
            flex: 1,
            padding: "36px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {loading ? (
            /* Skeleton Loading State */
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                background: "rgba(45, 27, 61,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "104px", height: "104px", borderRadius: "50%" }} className="skeleton" />
              </div>
              <div style={{ height: "48px" }} className="skeleton" />
              <div style={{ height: "48px" }} className="skeleton" />
              <div style={{ height: "48px" }} className="skeleton" />
              <div style={{ height: "52px", borderRadius: "12px" }} className="skeleton" />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                background: "rgba(45, 27, 61,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "40px",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212, 175, 55,0.06)",
                position: "relative",
              }}
            >
              {/* Background ambient glow */}
              <div
                style={{
                  position: "absolute",
                  width: "280px",
                  height: "280px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(212, 175, 55,0.12), transparent 70%)",
                  top: "20px",
                  right: "-40px",
                  pointerEvents: "none",
                }}
              />

              {/* Avatar Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "32px",
                }}
              >
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <Avatar
                    src={user?.avatar}
                    name={user?.name || "User"}
                    size="xl"
                    isEditable
                    glow
                    onUpload={handleAvatarUpload}
                  />
                  {uploadingAvatar && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(30, 20, 37,0.8)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "3px solid rgba(212, 175, 55,0.3)",
                          borderTopColor: "#D4AF37",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    </div>
                  )}
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F8F5F0", marginBottom: "4px" }}>
                  {user?.name}
                </h2>
                <p style={{ fontSize: "0.88rem", color: "#B8AEC2", marginBottom: "12px" }}>{user?.email}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Badge variant={user?.role === "admin" ? "blue" : "neutral"}>
                    <Shield size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    {user?.role?.toUpperCase()}
                  </Badge>
                  <Badge variant={user?.isBlocked ? "rejected" : "approved"} dot={!user?.isBlocked}>
                    {user?.isBlocked ? "Blocked" : "Active Member"}
                  </Badge>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Section Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                  <Sparkles size={16} color="#D4AF37" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F5C842", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Personal Information
                  </span>
                </div>

                {/* Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#B8AEC2" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <UserIcon size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="Your full name"
                      style={{
                        width: "100%",
                        padding: "12px 16px 12px 42px",
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${errors.name ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "10px",
                        color: "#F8F5F0",
                        fontSize: "0.95rem",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        fontFamily: "inherit",
                      }}
                      onFocus={(e) => {
                        if (!errors.name) {
                          e.currentTarget.style.borderColor = "#D4AF37";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 175, 55,0.15)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.name) {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    />
                  </div>
                  {errors.name && <span style={{ fontSize: "0.75rem", color: "#EF4444" }}>{errors.name}</span>}
                </div>

                {/* Phone */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#B8AEC2" }}>Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="+1 555 0199"
                      style={{
                        width: "100%",
                        padding: "12px 16px 12px 42px",
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${errors.phone ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "10px",
                        color: "#F8F5F0",
                        fontSize: "0.95rem",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        fontFamily: "inherit",
                      }}
                      onFocus={(e) => {
                        if (!errors.phone) {
                          e.currentTarget.style.borderColor = "#D4AF37";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 175, 55,0.15)";
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.phone) {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    />
                  </div>
                  {errors.phone && <span style={{ fontSize: "0.75rem", color: "#EF4444" }}>{errors.phone}</span>}
                </div>

                {/* Address */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#B8AEC2" }}>Physical Address / City</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Manhattan, New York, NY"
                      style={{
                        width: "100%",
                        padding: "12px 16px 12px 42px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#F8F5F0",
                        fontSize: "0.95rem",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        fontFamily: "inherit",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#D4AF37";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 175, 55,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Read-Only Account Details */}
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                    <Lock size={15} color="#606070" />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#B8AEC2", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Account Credentials (Read-Only)
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                      <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</div>
                      <div style={{ fontSize: "0.88rem", color: "#B8AEC2", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user?.email}
                      </div>
                    </div>

                    <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                      <div style={{ fontSize: "0.72rem", color: "#606070", textTransform: "uppercase", letterSpacing: "0.05em" }}>Joined Date</div>
                      <div style={{ fontSize: "0.88rem", color: "#B8AEC2", marginTop: "4px" }}>
                        {formatDate(user?.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    padding: "14px",
                    background: saving
                      ? "rgba(212, 175, 55,0.4)"
                      : "linear-gradient(135deg, #D4AF37, #F5C842)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: saving ? "none" : "0 6px 24px rgba(212, 175, 55,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  {saving ? (
                    <>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
