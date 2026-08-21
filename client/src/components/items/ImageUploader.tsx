"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];

    const fileList = Array.from(newFiles);

    if (images.length + fileList.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    for (const file of fileList) {
      if (!allowedTypes.includes(file.type)) {
        setError(`"${file.name}" is not a supported image format.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the maximum ${maxSizeMB}MB file size limit.`);
        return;
      }

      validFiles.push(file);
    }

    onChange([...images, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Drop Zone */}
      {images.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#D4AF37" : "rgba(255,255,255,0.12)"}`,
            borderRadius: "16px",
            padding: "28px 20px",
            background: dragOver ? "rgba(212, 175, 55,0.06)" : "#F9FAFB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#D4AF37";
            e.currentTarget.style.background = "rgba(212, 175, 55,0.04)";
          }}
          onMouseLeave={(e) => {
            if (!dragOver) {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.background = "#F9FAFB";
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg,image/gif"
            onChange={(e) => {
              if (e.target.files) validateAndAddFiles(e.target.files);
              e.target.value = ""; // Reset input
            }}
            style={{ display: "none" }}
          />

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#FDF4D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4AF37",
              marginBottom: "12px",
            }}
          >
            <UploadCloud size={24} />
          </div>

          <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
            Click to upload or drag & drop photos
          </p>
          <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>
            PNG, JPG, WEBP or GIF (Max {maxFiles} images, {maxSizeMB}MB each)
          </p>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "8px",
            fontSize: "0.8rem",
            color: "#FCA5A5",
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Thumbnail Previews */}
      {images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px", marginTop: "4px" }}>
          {images.map((file, index) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%", // 1:1 Aspect ratio
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #F3F4F6",
                  background: "#FFFFFF",
                }}
              >
                <img
                  src={previewUrl}
                  alt={`Preview ${index + 1}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#EF4444")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.75)")}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
