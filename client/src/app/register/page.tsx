"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { authService } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (form.password !== form.confirm) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (!agreed) {
      setErrorMessage("Please agree to the Terms of Service & Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      await authService.register(form.name.trim(), form.email.trim(), form.password);
      router.push("/dashboard/profile");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to create account";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px 12px 42px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#F5F5F7",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#3B82F6";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.boxShadow = "none";
  };

  const strengthChecks = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password),
    /[0-9]/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password),
  ];
  const strength = strengthChecks.filter(Boolean).length;
  const strengthColor = ["#EF4444", "#F59E0B", "#3B82F6", "#22C55E"][Math.max(0, strength - 1)] || "#606070";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", top: "-150px", right: "-100px", animation: "float2 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)", bottom: "-100px", left: "-80px", animation: "float 10s ease-in-out infinite" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 5 }}>
        {/* Card */}
        <div
          style={{
            background: "rgba(18,20,28,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "48px 40px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.06)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "linear-gradient(135deg, #3B82F6, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(59,130,246,0.5)" }}>
                <Search size={22} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ReFind
              </span>
            </Link>
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, textAlign: "center", marginBottom: "8px", color: "#F5F5F7", letterSpacing: "-0.02em" }}>
            Create your account
          </h1>
          <p style={{ textAlign: "center", color: "#A1A1AA", fontSize: "0.9rem", marginBottom: "28px" }}>
            Join thousands recovering their lost items with AI
          </p>

          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <AlertCircle size={16} color="#EF4444" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div style={{ fontSize: "0.85rem", color: "#FCA5A5", lineHeight: 1.4 }}>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#A1A1AA" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#A1A1AA" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#A1A1AA" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#606070", display: "flex", alignItems: "center", padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} style={{ flex: 1, height: "3px", borderRadius: "2px", background: n <= strength ? strengthColor : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#A1A1AA" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                  style={{ ...inputStyle, paddingRight: "44px", borderColor: form.confirm && form.confirm !== form.password ? "#EF4444" : "rgba(255,255,255,0.1)" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#606070", display: "flex", alignItems: "center", padding: 0 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle2 size={16} color="#22C55E" style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)" }} />
                )}
              </div>
            </div>

            {/* Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <div
                onClick={() => setAgreed(!agreed)}
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "5px",
                  border: agreed ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  background: agreed ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {agreed && <CheckCircle2 size={12} color="#fff" />}
              </div>
              <span style={{ fontSize: "0.83rem", color: "#A1A1AA", lineHeight: 1.5 }}>
                I agree to the{" "}
                <Link href="#" style={{ color: "#3B82F6", textDecoration: "none" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" style={{ color: "#3B82F6", textDecoration: "none" }}>Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              style={{
                width: "100%",
                padding: "14px",
                background: loading || !agreed
                  ? "rgba(59,130,246,0.3)"
                  : "linear-gradient(135deg, #3B82F6, #06B6D4)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading || !agreed ? "not-allowed" : "pointer",
                boxShadow: loading || !agreed ? "none" : "0 6px 24px rgba(59,130,246,0.4)",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading && agreed) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(59,130,246,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = loading || !agreed ? "none" : "0 6px 24px rgba(59,130,246,0.4)";
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p style={{ textAlign: "center", color: "#A1A1AA", fontSize: "0.88rem", marginTop: "24px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#3B82F6", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#60A5FA")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#3B82F6")}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
