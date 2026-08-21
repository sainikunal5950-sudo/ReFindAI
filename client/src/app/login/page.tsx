"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Ban } from "lucide-react";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlockedError, setIsBlockedError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsBlockedError(false);
    setLoading(true);

    try {
      const data = await authService.login(email.trim(), password);
      if (data?.user?.role === "admin") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard/profile");
      }
    } catch (err: any) {
      const status = err.response?.status;
      const rawMsg = err.response?.data?.message || err.message || "Invalid email or password";

      if (status === 403 || rawMsg.toLowerCase().includes("block")) {
        setIsBlockedError(true);
        setErrorMessage("Your account has been blocked. Please contact support.");
      } else {
        setErrorMessage(rawMsg);
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)", top: "-150px", left: "-100px", animation: "float 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.10), transparent 70%)", bottom: "-100px", right: "-80px", animation: "float2 12s ease-in-out infinite" }} />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "rgba(18,20,28,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "48px 40px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 24px rgba(59,130,246,0.5)",
                }}
              >
                <Search size={22} color="#fff" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ReFind
              </span>
            </Link>
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, textAlign: "center", marginBottom: "8px", color: "#F5F5F7", letterSpacing: "-0.02em" }}>
            Welcome back
          </h1>
          <p style={{ textAlign: "center", color: "#A1A1AA", fontSize: "0.9rem", marginBottom: "28px" }}>
            Sign in to your account to continue
          </p>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: isBlockedError ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
                border: isBlockedError ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(239,68,68,0.25)",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                animation: "shake 0.3s ease-in-out",
              }}
            >
              <div style={{ marginTop: "2px", flexShrink: 0 }}>
                {isBlockedError ? <Ban size={16} color="#EF4444" /> : <AlertCircle size={16} color="#EF4444" />}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#FCA5A5", lineHeight: 1.4 }}>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#A1A1AA", letterSpacing: "0.02em" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
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
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3B82F6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#A1A1AA", letterSpacing: "0.02em" }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: "0.8rem", color: "#3B82F6", textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#60A5FA")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#3B82F6")}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 42px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#F5F5F7",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3B82F6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#606070",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "rgba(59,130,246,0.5)"
                  : "linear-gradient(135deg, #3B82F6, #06B6D4)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 6px 24px rgba(59,130,246,0.4)",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(59,130,246,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? "none" : "0 6px 24px rgba(59,130,246,0.4)";
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "#606070", fontSize: "0.8rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", color: "#A1A1AA", fontSize: "0.88rem" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ color: "#3B82F6", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#60A5FA")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#3B82F6")}
            >
              Create one free <Sparkles size={12} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "24px", flexWrap: "wrap" }}>
          {["🔒 SSL Secured", "🛡️ Privacy First", "✨ Free to Use"].map((t) => (
            <span key={t} style={{ fontSize: "0.75rem", color: "#606070" }}>{t}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </main>
  );
}
