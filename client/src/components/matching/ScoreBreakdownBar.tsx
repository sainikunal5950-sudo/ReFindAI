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
  color = "#D4AF37",
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
            color: "#B8AEC2",
            fontWeight: 500,
          }}
        >
          {icon}
          {label}
        </span>
        <span style={{ fontWeight: 700, color: "#F8F5F0" }}>{score}%</span>
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
              : `linear-gradient(90deg, ${color}, #F5C842)`,
            borderRadius: "999px",
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
