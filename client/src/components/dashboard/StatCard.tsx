"use client";

import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: string;
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  accentColor = "#D4AF37",
}: StatCardProps) {
  return (
    <div
      style={{
        background: "rgba(45, 27, 61, 0.85)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        borderRadius: "18px",
        padding: "20px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}80`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Background Accent Glow */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: accentColor,
          filter: "blur(40px)",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#B8AEC2" }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#F8F5F0", letterSpacing: "-0.02em" }}>
          {value}
        </span>
      </div>

      {/* Trend or Subtitle */}
      {trend && (
        <span style={{ fontSize: "0.74rem", color: "#B8AEC2", fontWeight: 500 }}>
          {trend}
        </span>
      )}
    </div>
  );
}
