import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report Found Item — Retrivo",
  description: "Report a found item and help reunite it with its owner.",
};

export default function FoundPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>🎁 Report Found Item</h1>
        <p style={{ color: "#a0a0c0" }}>Found item reporting form — coming in Module 3.</p>
      </div>
    </main>
  );
}
