import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report Lost Item — Retrivo",
  description: "Report a lost item and let our AI find a match for you.",
};

export default function LostPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>😢 Report Lost Item</h1>
        <p style={{ color: "#a0a0c0" }}>Lost item reporting form — coming in Module 3.</p>
      </div>
    </main>
  );
}
