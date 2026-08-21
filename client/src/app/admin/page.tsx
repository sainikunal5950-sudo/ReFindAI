"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import {
  Users,
  Package,
  ClipboardCheck,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

const adminStats = [
  { label: "Total Users", value: "2,847", icon: <Users size={22} />, change: "+124 this week", color: "#3B82F6" },
  { label: "Total Items", value: "5,213", icon: <Package size={22} />, change: "+89 today", color: "#06B6D4" },
  { label: "Pending Claims", value: "38", icon: <AlertTriangle size={22} />, change: "Needs review", color: "#F59E0B" },
  { label: "Resolved Cases", value: "1,492", icon: <CheckCircle size={22} />, change: "94% success rate", color: "#22C55E" },
];

const claims = [
  { id: "CLM-001", item: "iPhone 13 Pro (Space Gray)", reporter: "John Doe", claimant: "Sarah M.", date: "Aug 19, 2026", status: "pending" as const },
  { id: "CLM-002", item: "Blue North Face Backpack", reporter: "Alice K.", claimant: "Mike T.", date: "Aug 18, 2026", status: "approved" as const },
  { id: "CLM-003", item: "Apple Watch Series 9", reporter: "Bob R.", claimant: "Emma L.", date: "Aug 18, 2026", status: "pending" as const },
  { id: "CLM-004", item: "Black Leather Wallet", reporter: "Carol P.", claimant: "Dave S.", date: "Aug 17, 2026", status: "rejected" as const },
  { id: "CLM-005", item: "Prescription Glasses", reporter: "Eve W.", claimant: "Frank G.", date: "Aug 17, 2026", status: "approved" as const },
  { id: "CLM-006", item: "Gold Ring with Diamond", reporter: "Grace H.", claimant: "Henry J.", date: "Aug 16, 2026", status: "pending" as const },
  { id: "CLM-007", item: "Passport (Indian)", reporter: "Ian K.", claimant: "Julia L.", date: "Aug 15, 2026", status: "approved" as const },
];

const users = [
  { name: "John Doe", email: "john@email.com", role: "user", status: "active", items: 4, joined: "Jan 2026" },
  { name: "Sarah Mitchell", email: "sarah@email.com", role: "user", status: "active", items: 7, joined: "Mar 2026" },
  { name: "Mike Thompson", email: "mike@email.com", role: "user", status: "suspended", items: 2, joined: "May 2026" },
  { name: "Admin User", email: "admin@refind.ai", role: "admin", status: "active", items: 0, joined: "Jan 2025" },
  { name: "Emma Liu", email: "emma@email.com", role: "user", status: "active", items: 12, joined: "Jul 2026" },
];

type Tab = "claims" | "users";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("claims");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredClaims = claims.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.item.toLowerCase().includes(q) || c.reporter.toLowerCase().includes(q) || c.claimant.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const th: React.CSSProperties = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#606070",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap",
  };

  const td: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: "0.88rem",
    color: "#F5F5F7",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    verticalAlign: "middle",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <Sidebar variant="admin" />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header
          style={{
            height: "68px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "rgba(13,15,20,0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
              <Shield size={16} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7" }}>Admin Panel</h1>
              <p style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>Manage users, items, and claims</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.8rem", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "8px", padding: "6px 12px", color: "#FCD34D" }}>
              <AlertTriangle size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
              38 claims need review
            </span>
          </div>
        </header>

        <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {adminStats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "22px",
                  background: "rgba(18,20,28,0.9)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  transition: "all 0.25s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}40`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle, ${s.color}12, transparent 70%)`, transform: "translate(30%, -30%)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <p style={{ fontSize: "0.74rem", fontWeight: 600, color: "#A1A1AA", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</p>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                    {s.icon}
                  </div>
                </div>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: "#F5F5F7", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px" }}>{s.value}</p>
                <p style={{ fontSize: "0.74rem", color: s.color, fontWeight: 500 }}>
                  <TrendingUp size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          {/* Management Panel */}
          <div style={{ background: "rgba(18,20,28,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {([["claims", "Claims Management"], ["users", "User Management"]] as [Tab, string][]).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "16px 24px",
                    background: activeTab === tab ? "rgba(59,130,246,0.08)" : "transparent",
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #3B82F6" : "2px solid transparent",
                    color: activeTab === tab ? "#3B82F6" : "#A1A1AA",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search & Filter */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                <Search size={14} color="#606070" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder={activeTab === "claims" ? "Search claims..." : "Search users..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 34px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#F5F5F7",
                    fontSize: "0.85rem",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              {activeTab === "claims" && (
                <div style={{ position: "relative" }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: "9px 32px 9px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      color: "#A1A1AA",
                      fontSize: "0.85rem",
                      outline: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      appearance: "none",
                    }}
                  >
                    <option value="all" style={{ background: "#0D0F14" }}>All Status</option>
                    <option value="pending" style={{ background: "#0D0F14" }}>Pending</option>
                    <option value="approved" style={{ background: "#0D0F14" }}>Approved</option>
                    <option value="rejected" style={{ background: "#0D0F14" }}>Rejected</option>
                  </select>
                  <ChevronDown size={14} color="#606070" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              )}
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              {activeTab === "claims" ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                      <th style={th}>Claim ID</th>
                      <th style={th}>Item</th>
                      <th style={th}>Reporter</th>
                      <th style={th}>Claimant</th>
                      <th style={th}>Date</th>
                      <th style={th}>Status</th>
                      <th style={th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim) => (
                      <tr
                        key={claim.id}
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                      >
                        <td style={{ ...td, color: "#60A5FA", fontWeight: 600, fontFamily: "monospace", fontSize: "0.82rem" }}>{claim.id}</td>
                        <td style={{ ...td, maxWidth: "200px" }}>
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{claim.item}</span>
                        </td>
                        <td style={{ ...td, color: "#A1A1AA" }}>{claim.reporter}</td>
                        <td style={{ ...td, color: "#A1A1AA" }}>{claim.claimant}</td>
                        <td style={{ ...td, color: "#606070", fontSize: "0.82rem" }}>{claim.date}</td>
                        <td style={td}>
                          <Badge variant={claim.status} dot={claim.status === "pending"}>
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </Badge>
                        </td>
                        <td style={td}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button style={{ padding: "5px 10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "6px", color: "#4ADE80", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button style={{ padding: "5px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "6px", color: "#F87171", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}>
                              <XCircle size={12} /> Reject
                            </button>
                            <button style={{ padding: "5px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#A1A1AA", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center" }}>
                              <Eye size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                      <th style={th}>User</th>
                      <th style={th}>Email</th>
                      <th style={th}>Role</th>
                      <th style={th}>Status</th>
                      <th style={th}>Reports</th>
                      <th style={th}>Joined</th>
                      <th style={th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter((u) => {
                      const q = search.toLowerCase();
                      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                    }).map((user, i) => (
                      <tr
                        key={i}
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                      >
                        <td style={td}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ ...td, color: "#A1A1AA", fontSize: "0.83rem" }}>{user.email}</td>
                        <td style={td}>
                          <Badge variant={user.role === "admin" ? "error" : "blue"}>
                            {user.role === "admin" ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td style={td}>
                          <Badge variant={user.status === "active" ? "success" : "error"}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </td>
                        <td style={{ ...td, color: "#3B82F6", fontWeight: 700 }}>{user.items}</td>
                        <td style={{ ...td, color: "#606070", fontSize: "0.82rem" }}>{user.joined}</td>
                        <td style={td}>
                          <button style={{ padding: "5px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#A1A1AA", cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <MoreHorizontal size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#606070" }}>
                Showing {activeTab === "claims" ? filteredClaims.length : users.length} results
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      background: p === 1 ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : "rgba(255,255,255,0.04)",
                      border: p === 1 ? "none" : "1px solid rgba(255,255,255,0.08)",
                      color: p === 1 ? "#fff" : "#A1A1AA",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
