"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreRing({
  score,
  size = 72,
  strokeWidth = 6,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine glow and gradient based on match level
  const isHighMatch = score >= 80;
  const isMedMatch = score >= 60 && score < 80;

  const gradId = `scoreGrad-${score}-${size}`;
  const glowColor = isHighMatch ? "#D4AF37" : isMedMatch ? "#F5C842" : "#FBBF24";

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F5C842" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F9FAFB"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 6px ${glowColor}70)`,
          }}
        />
      </svg>

      {/* Percentage Center Text */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: size > 80 ? "1.2rem" : "0.95rem",
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: "-0.02em",
          }}
        >
          {score}%
        </span>
        <span
          style={{
            fontSize: size > 80 ? "0.65rem" : "0.55rem",
            fontWeight: 700,
            color: "#D4AF37",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginTop: "2px",
          }}
        >
          Match
        </span>
      </div>
    </div>
  );
}
