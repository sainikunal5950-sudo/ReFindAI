"use client";

import React from "react";

type BadgeVariant =
  | "gold"
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
  gold: {
    background: "rgba(212,175,55,0.15)",
    color: "#F5C842",
    border: "1px solid rgba(212,175,55,0.35)",
  },
  blue: {
    background: "rgba(212,175,55,0.15)",
    color: "#F5C842",
    border: "1px solid rgba(212,175,55,0.35)",
  },
  cyan: {
    background: "rgba(234,179,8,0.15)",
    color: "#FDE047",
    border: "1px solid rgba(234,179,8,0.35)",
  },
  success: {
    background: "rgba(74,222,128,0.12)",
    color: "#4ADE80",
    border: "1px solid rgba(74,222,128,0.3)",
  },
  error: {
    background: "rgba(248,113,113,0.12)",
    color: "#F87171",
    border: "1px solid rgba(248,113,113,0.3)",
  },
  warning: {
    background: "rgba(251,191,36,0.12)",
    color: "#FBBF24",
    border: "1px solid rgba(251,191,36,0.3)",
  },
  pending: {
    background: "rgba(251,191,36,0.12)",
    color: "#FBBF24",
    border: "1px solid rgba(251,191,36,0.3)",
  },
  approved: {
    background: "rgba(74,222,128,0.12)",
    color: "#4ADE80",
    border: "1px solid rgba(74,222,128,0.3)",
  },
  rejected: {
    background: "rgba(248,113,113,0.12)",
    color: "#F87171",
    border: "1px solid rgba(248,113,113,0.3)",
  },
  neutral: {
    background: "rgba(255,255,255,0.06)",
    color: "#B8AEC2",
    border: "1px solid rgba(255,255,255,0.1)",
  },
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({
  children,
  variant = "neutral",
  dot = false,
  size = "md",
  className = "",
  style = {},
}: BadgeProps) {
  const isSm = size === "sm";

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSm ? "4px" : "6px",
        padding: isSm ? "2px 7px" : "3px 10px",
        borderRadius: "999px",
        fontSize: isSm ? "0.72rem" : "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: isSm ? "5px" : "6px",
            height: isSm ? "5px" : "6px",
            borderRadius: "50%",
            backgroundColor: "currentColor",
            boxShadow: "0 0 6px currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
