import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Retrivo",
  description: "View your lost & found activity on Retrivo.",
};

export default function DashboardPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>📊 Dashboard</h1>
        <p style={{ color: "#a0a0c0" }}>User dashboard — coming in Module 3.</p>
      </div>
    </main>
  );
}
