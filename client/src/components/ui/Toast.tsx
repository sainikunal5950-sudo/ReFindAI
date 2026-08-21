"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id?: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const config = {
    success: {
      icon: <CheckCircle2 size={18} color="#4ADE80" />,
      border: "rgba(34,197,94,0.3)",
      bg: "rgba(45, 27, 61,0.95)",
      textColor: "#F8F5F0",
      glow: "0 8px 32px rgba(34,197,94,0.15)",
    },
    error: {
      icon: <AlertCircle size={18} color="#F87171" />,
      border: "rgba(239,68,68,0.3)",
      bg: "rgba(45, 27, 61,0.95)",
      textColor: "#F8F5F0",
      glow: "0 8px 32px rgba(239,68,68,0.15)",
    },
    info: {
      icon: <Info size={18} color="#F5C842" />,
      border: "rgba(212, 175, 55,0.3)",
      bg: "rgba(45, 27, 61,0.95)",
      textColor: "#F8F5F0",
      glow: "0 8px 32px rgba(212, 175, 55,0.15)",
    },
  }[toast.type];

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        minWidth: "320px",
        maxWidth: "420px",
        padding: "14px 18px",
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "14px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: config.glow,
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "2px" }}>{config.icon}</div>
      <div style={{ flex: 1, fontSize: "0.88rem", color: config.textColor, lineHeight: 1.4 }}>
        {toast.message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#B8AEC2",
          cursor: "pointer",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
