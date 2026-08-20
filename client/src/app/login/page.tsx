import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Retrivo",
  description: "Log in to your Retrivo account.",
};

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>🔐 Login</h1>
        <p style={{ color: "#a0a0c0" }}>Authentication — coming in Module 2.</p>
      </div>
    </main>
  );
}
