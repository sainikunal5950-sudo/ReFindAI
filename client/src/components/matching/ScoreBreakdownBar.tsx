"use client";

import React from "react";

interface ScoreBreakdownBarProps {
  label: string;
  score: number;
  icon?: React.ReactNode;
  color?: string;
}

export default function ScoreBreakdownBar({
  label,
  score,
  icon,
  color = "#3B82F6",
}: ScoreBreakdownBarProps) {
  const normalized = Math.min(100, Math.max(0, score));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#A1A1AA",
            fontWeight: 500,
          }}
        >
          {icon}
          {label}
        </span>
        <span style={{ fontWeight: 700, color: "#F5F5F7" }}>{score}%</span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: "100%",
          height: "5px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${normalized}%`,
            height: "100%",
            background: color.startsWith("linear")
              ? color
              : `linear-gradient(90deg, ${color}, #06B6D4)`,
            borderRadius: "999px",
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
