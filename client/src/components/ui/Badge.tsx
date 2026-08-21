"use client";

import React from "react";

type BadgeVariant =
  | "blue"
  | "cyan"
  | "success"
  | "error"
  | "warning"
  | "pending"
  | "approved"
  | "rejected"
  | "neutral";

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  blue: {
    background: "rgba(59,130,246,0.15)",
    color: "#60A5FA",
    border: "1px solid rgba(59,130,246,0.3)",
  },
  cyan: {
    background: "rgba(6,182,212,0.12)",
    color: "#22D3EE",
    border: "1px solid rgba(6,182,212,0.3)",
  },
  success: {
    background: "rgba(34,197,94,0.12)",
    color: "#4ADE80",
    border: "1px solid rgba(34,197,94,0.3)",
  },
  error: {
    background: "rgba(239,68,68,0.12)",
    color: "#F87171",
    border: "1px solid rgba(239,68,68,0.3)",
  },
  warning: {
    background: "rgba(245,158,11,0.12)",
    color: "#FCD34D",
    border: "1px solid rgba(245,158,11,0.3)",
  },
  pending: {
    background: "rgba(245,158,11,0.12)",
    color: "#FCD34D",
    border: "1px solid rgba(245,158,11,0.3)",
  },
  approved: {
    background: "rgba(34,197,94,0.12)",
    color: "#4ADE80",
    border: "1px solid rgba(34,197,94,0.3)",
  },
  rejected: {
    background: "rgba(239,68,68,0.12)",
    color: "#F87171",
    border: "1px solid rgba(239,68,68,0.3)",
  },
  neutral: {
    background: "rgba(255,255,255,0.06)",
    color: "#A1A1AA",
    border: "1px solid rgba(255,255,255,0.1)",
  },
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  style?: React.CSSProperties;
}

export default function Badge({
  variant = "blue",
  children,
  dot = false,
  style,
}: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "currentColor",
            animation: "pulse-dot 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
