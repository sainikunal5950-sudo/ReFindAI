import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — Retrivo",
  description: "Retrivo admin dashboard for moderation and analytics.",
};

export default function AdminPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>🛡️ Admin Panel</h1>
        <p style={{ color: "#a0a0c0" }}>Admin dashboard — coming in Module 6.</p>
      </div>
    </main>
  );
}
