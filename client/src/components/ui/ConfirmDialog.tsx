"use client";

import React from "react";
import { AlertTriangle, X, Trash2, Ban, Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = {
    danger: {
      icon: <Trash2 size={24} color="#EF4444" />,
      iconBg: "rgba(239,68,68,0.15)",
      btnBg: "linear-gradient(135deg, #EF4444, #DC2626)",
      btnGlow: "0 4px 16px rgba(239,68,68,0.35)",
    },
    warning: {
      icon: <Ban size={24} color="#F59E0B" />,
      iconBg: "rgba(245,158,11,0.15)",
      btnBg: "linear-gradient(135deg, #F59E0B, #D97706)",
      btnGlow: "0 4px 16px rgba(245,158,11,0.35)",
    },
    primary: {
      icon: <Check size={24} color="#D4AF37" />,
      iconBg: "#FDF4D8",
      btnBg: "linear-gradient(135deg, #D4AF37, #F5C842)",
      btnGlow: "0 4px 16px #F5E5B8",
    },
  }[variant];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#FFFFFF",
          border: "1px solid #F3F4F6",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          position: "relative",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: config.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {config.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "6px" }}>
              {title}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#6B6B6B", lineHeight: 1.5 }}>{message}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              color: "#6B6B6B",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.color = "#6B6B6B";
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              background: config.btnBg,
              border: "none",
              color: "#FFFFFF",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: config.btnGlow,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
