import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — Retrivo",
  description: "Create your Retrivo account.",
};

export default function RegisterPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>✍️ Register</h1>
        <p style={{ color: "#a0a0c0" }}>Registration — coming in Module 2.</p>
      </div>
    </main>
  );
}
