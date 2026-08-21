"use client";

import React, { useState } from "react";
import { Camera, User as UserIcon } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onUpload?: (file: File) => void;
  isEditable?: boolean;
  glow?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { dim: 28, fontSize: "0.7rem", iconSize: 14 },
  sm: { dim: 36, fontSize: "0.8rem", iconSize: 16 },
  md: { dim: 48, fontSize: "1rem", iconSize: 20 },
  lg: { dim: 72, fontSize: "1.4rem", iconSize: 28 },
  xl: { dim: 104, fontSize: "2rem", iconSize: 38 },
};

export default function Avatar({
  src,
  name = "User",
  size = "md",
  onUpload,
  isEditable = false,
  glow = true,
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { dim, fontSize, iconSize } = sizeMap[size] || sizeMap.md;

  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  const getFullSrc = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${dim}px`,
        height: `${dim}px`,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: glow ? "0 0 20px rgba(212, 175, 55,0.35)" : "none",
        border: glow ? "2px solid rgba(212, 175, 55,0.5)" : "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(135deg, #26182F, #2D1B3D)",
        overflow: "hidden",
      }}
      className={`group ${className}`}
    >
      {src && !imgError ? (
        <img
          src={getFullSrc(src)}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #B89628, #F5C842)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize,
            letterSpacing: "0.02em",
            userSelect: "none",
          }}
        >
          {initials || <UserIcon size={iconSize} />}
        </div>
      )}

      {/* Upload Overlay */}
      {isEditable && (
        <label
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(30, 20, 37,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: "#F5C842",
            opacity: 0,
            transition: "opacity 0.2s ease",
            cursor: "pointer",
            borderRadius: "50%",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
        >
          <Camera size={iconSize} />
          {size === "xl" && (
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#F8F5F0" }}>
              Change
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      )}
    </div>
  );
}
