"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  GitCompare,
  ClipboardCheck,
  Settings,
  Search,
  Shield,
  Users,
  Package,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  variant?: "user" | "admin";
}

const userNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/lost", label: "Lost Items", icon: <FileSearch size={18} /> },
  { href: "/found", label: "Found Items", icon: <Package size={18} /> },
  { href: "/dashboard/matches", label: "My Matches", icon: <GitCompare size={18} /> },
  { href: "/dashboard/claims", label: "Claims", icon: <ClipboardCheck size={18} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/items", label: "Items", icon: <Package size={18} /> },
  { href: "/admin/claims", label: "Claims", icon: <ClipboardCheck size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar({ variant = "user" }: SidebarProps) {
  const pathname = usePathname();
  const nav = variant === "admin" ? adminNav : userNav;

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#0D0F14",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px 24px",
          textDecoration: "none",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 14px rgba(59,130,246,0.4)",
            flexShrink: 0,
          }}
        >
          <Search size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ReFind
        </span>
        {variant === "admin" && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.65rem",
              fontWeight: 700,
              background: "rgba(239,68,68,0.15)",
              color: "#EF4444",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "6px",
              padding: "2px 6px",
              letterSpacing: "0.05em",
            }}
          >
            ADMIN
          </span>
        )}
      </Link>

      {/* Navigation Items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                color: active ? "#3B82F6" : "#A1A1AA",
                background: active ? "rgba(59,130,246,0.1)" : "transparent",
                borderLeft: active ? "2px solid #3B82F6" : "2px solid transparent",
                fontWeight: active ? 600 : 400,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#F5F5F7";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#A1A1AA";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }
              }}
            >
              <span style={{ color: active ? "#3B82F6" : "#606070" }}>{item.icon}</span>
              <span>{item.label}</span>
              {active && (
                <ChevronRight size={14} style={{ marginLeft: "auto", color: "#3B82F6" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user info placeholder */}
      <div
        style={{
          marginTop: "auto",
          padding: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {variant === "admin" ? <Shield size={16} /> : "U"}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#F5F5F7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {variant === "admin" ? "Admin User" : "John Doe"}
          </p>
          <p style={{ fontSize: "0.72rem", color: "#A1A1AA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {variant === "admin" ? "admin@refind.ai" : "john@email.com"}
          </p>
        </div>
      </div>
    </aside>
  );
}
