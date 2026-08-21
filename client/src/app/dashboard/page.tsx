"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import {
  FileSearch,
  CheckCircle,
  GitCompare,
  Package,
  Clock,
  MapPin,
  TrendingUp,
  Bell,
  Plus,
  ArrowRight,
  AlertCircle,
  Star,
} from "lucide-react";

const stats = [
  { label: "Total Reports", value: "12", icon: <FileSearch size={22} />, change: "+3 this week", color: "#D4AF37" },
  { label: "Active Matches", value: "4", icon: <GitCompare size={22} />, change: "2 new today", color: "#92700F" },
  { label: "Claims Pending", value: "2", icon: <AlertCircle size={22} />, change: "Needs action", color: "#F59E0B" },
  { label: "Items Recovered", value: "6", icon: <CheckCircle size={22} />, change: "+1 this week", color: "#22C55E" },
];

const activity = [
  { type: "match", icon: <GitCompare size={14} />, color: "#D4AF37", text: "92% match found for your lost iPhone 13 Pro", time: "2 hours ago" },
  { type: "report", icon: <FileSearch size={14} />, color: "#92700F", text: "You reported a lost blue backpack near Central Park", time: "5 hours ago" },
  { type: "claim", icon: <AlertCircle size={14} />, color: "#F59E0B", text: "Claim submitted for Found AirPods — awaiting verification", time: "1 day ago" },
  { type: "recovered", icon: <CheckCircle size={14} />, color: "#22C55E", text: "Your wallet has been successfully recovered!", time: "2 days ago" },
  { type: "report", icon: <FileSearch size={14} />, color: "#92700F", text: "You reported found car keys at Times Square Station", time: "3 days ago" },
  { type: "match", icon: <Star size={14} />, color: "#D4AF37", text: "New match alert: Your lost headphones — 88% confidence", time: "4 days ago" },
];

const matches = [
  { title: "iPhone 13 Pro (Space Gray)", location: "Manhattan, NY", score: 92, status: "pending" },
  { title: "Blue North Face Backpack", location: "Brooklyn, NY", score: 78, status: "reviewing" },
  { title: "AirPods Pro (White Case)", location: "Queens, NY", score: 71, status: "pending" },
  { title: "Black Leather Wallet", location: "Bronx, NY", score: 65, status: "claimed" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"activity" | "matches">("activity");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <Sidebar variant="user" />

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header
          style={{
            height: "68px",
            borderBottom: "1px solid #F9FAFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "#FFFFFF",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" }}>Dashboard</h1>
            <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>Welcome back, John 👋</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              style={{
                position: "relative",
                background: "#F9FAFB",
                border: "1px solid #F9FAFB",
                borderRadius: "10px",
                padding: "8px 10px",
                cursor: "pointer",
                color: "#6B6B6B",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#D4AF37",
                  boxShadow: "0 0 8px rgba(212, 175, 55,0.6)",
                }}
              />
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px #F5E5B8",
                fontFamily: "inherit",
              }}
            >
              <Plus size={16} />
              New Report
            </button>
          </div>
        </header>

        {/* Page Body */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {/* Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "24px",
                  background: "#FFFFFF",
                  border: "1px solid #F9FAFB",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}40`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${s.color}18`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#F9FAFB";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Background tint */}
                <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", borderRadius: "50%", background: `radial-gradient(circle, ${s.color}12, transparent 70%)`, transform: "translate(30%, -30%)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B6B6B", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {s.label}
                  </p>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                    {s.icon}
                  </div>
                </div>
                <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "0.78rem", color: s.color, fontWeight: 500 }}>
                  <TrendingUp size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" }}>

            {/* Left: Tabs (Activity / Matches) */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #F9FAFB",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* Tab Header */}
              <div style={{ display: "flex", borderBottom: "1px solid #F9FAFB" }}>
                {(["activity", "matches"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "16px 20px",
                      background: activeTab === tab ? "rgba(212, 175, 55,0.08)" : "transparent",
                      border: "none",
                      borderBottom: activeTab === tab ? "2px solid #D4AF37" : "2px solid transparent",
                      color: activeTab === tab ? "#D4AF37" : "#6B6B6B",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    {tab === "activity" ? "Recent Activity" : "Top Matches"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: "20px" }}>
                {activeTab === "activity" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {activity.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "14px",
                          padding: "16px 0",
                          borderBottom: i < activity.length - 1 ? "1px solid #F9FAFB" : "none",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: `${item.color}15`,
                            border: `1px solid ${item.color}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: item.color,
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "0.88rem", color: "#1A1A1A", lineHeight: 1.5 }}>{item.text}</p>
                          <p style={{ fontSize: "0.75rem", color: "#606070", marginTop: "4px" }}>
                            <Clock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {matches.map((m, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "16px",
                          background: "#F9FAFB",
                          border: "1px solid #F9FAFB",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          transition: "all 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E5E5";
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(212, 175, 55,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#F9FAFB";
                          (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB";
                        }}
                      >
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "linear-gradient(135deg, #E5E5E5, rgba(245, 200, 66,0.2))", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</p>
                          <p style={{ fontSize: "0.76rem", color: "#6B6B6B" }}>
                            <MapPin size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                            {m.location}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: "1rem", fontWeight: 800, background: "linear-gradient(135deg, #D4AF37, #F5C842)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            {m.score}%
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#6B6B6B" }}>Match</div>
                        </div>
                        <ArrowRight size={14} color="#6B6B6B" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Actions + Mini Map */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Quick Actions */}
              <div style={{ padding: "24px", background: "#FFFFFF", border: "1px solid #F9FAFB", borderRadius: "16px" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "16px" }}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "Report Lost Item", icon: <FileSearch size={16} />, href: "/lost", primary: true },
                    { label: "Report Found Item", icon: <Package size={16} />, href: "/found", primary: false },
                    { label: "View All Matches", icon: <GitCompare size={16} />, href: "/dashboard/matches", primary: false },
                  ].map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: action.primary ? "linear-gradient(135deg, #D4AF37, #F5C842)" : "#F9FAFB",
                        border: action.primary ? "none" : "1px solid #F9FAFB",
                        color: action.primary ? "#fff" : "#6B6B6B",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        textDecoration: "none",
                        transition: "all 0.2s",
                        boxShadow: action.primary ? "0 4px 16px #F5E5B8" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!action.primary) {
                          (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A1A";
                          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212, 175, 55,0.08)";
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E5E5E5";
                        } else {
                          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(212, 175, 55,0.45)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!action.primary) {
                          (e.currentTarget as HTMLAnchorElement).style.color = "#6B6B6B";
                          (e.currentTarget as HTMLAnchorElement).style.background = "#F9FAFB";
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "#F9FAFB";
                        } else {
                          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px #F5E5B8";
                        }
                      }}
                    >
                      {action.icon}
                      {action.label}
                      <ArrowRight size={14} style={{ marginLeft: "auto" }} />
                    </a>
                  ))}
                </div>
              </div>

              {/* AI Insight Card */}
              <div
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(184, 150, 40,0.12), rgba(245, 200, 66,0.06))",
                  border: "1px solid #E5E5E5",
                  borderRadius: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37" }}>
                    <Star size={16} />
                  </div>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1A1A1A" }}>AI Insight</h3>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.6 }}>
                  Based on your reports, adding more photos increases match accuracy by <span style={{ color: "#D4AF37", fontWeight: 600 }}>34%</span>. Try updating your item descriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
