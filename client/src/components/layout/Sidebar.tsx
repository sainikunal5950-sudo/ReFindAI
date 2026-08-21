"use client";

import { useState, useEffect } from "react";
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
  User as UserIcon,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";
import { authService } from "@/services/authService";
import { User } from "@/types/user";
import Avatar from "../ui/Avatar";

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
  { href: "/dashboard/profile", label: "My Profile", icon: <UserIcon size={18} /> },
  { href: "/dashboard/notifications", label: "Notifications", icon: <Bell size={18} /> },
  { href: "/dashboard/lost-items", label: "My Lost Items", icon: <FileSearch size={18} /> },
  { href: "/dashboard/found-items", label: "My Found Items", icon: <Package size={18} /> },
  { href: "/lost", label: "Browse Lost", icon: <FileSearch size={18} /> },
  { href: "/found", label: "Browse Found", icon: <Package size={18} /> },
  { href: "/dashboard/matches", label: "My Matches", icon: <GitCompare size={18} /> },
  { href: "/dashboard/claims", label: "Claims", icon: <ClipboardCheck size={18} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/items", label: "Items", icon: <Package size={18} /> },
  { href: "/admin/claims", label: "Claims", icon: <ClipboardCheck size={18} /> },
  { href: "/admin/matches", label: "Matches", icon: <GitCompare size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar({ variant = "user" }: SidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const nav = variant === "admin" ? adminNav : userNav;

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <aside
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#150E1C",
        borderRight: "1px solid rgba(212, 175, 55, 0.15)",
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
            background: "linear-gradient(135deg, #D4AF37, #F5C842)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 14px rgba(212,175,55,0.45)",
            flexShrink: 0,
          }}
        >
          <Search size={16} color="#150E1C" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #F8F5F0, #D4AF37)",
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
              background: "rgba(212,175,55,0.15)",
              color: "#F5C842",
              border: "1px solid rgba(212,175,55,0.3)",
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
                color: active ? "#F5C842" : "#B8AEC2",
                background: active ? "rgba(212, 175, 55, 0.15)" : "transparent",
                borderLeft: active ? "3px solid #D4AF37" : "3px solid transparent",
                fontWeight: active ? 700 : 500,
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#F8F5F0";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#B8AEC2";
                }
              }}
            >
              <span
                style={{
                  color: active ? "#F5C842" : "#B8AEC2",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <ChevronRight
                  size={14}
                  style={{ marginLeft: "auto", color: "#F5C842", opacity: 0.8 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {currentUser ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="sm"
              glow={false}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#F8F5F0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                {currentUser.name}
              </p>
              <p
                style={{
                  fontSize: "0.6875rem",
                  color: "#B8AEC2",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {currentUser.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "#B8AEC2",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
              }}
              title="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "9px",
              borderRadius: "10px",
              background: "rgba(212,175,55,0.15)",
              color: "#F5C842",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            Log In
          </Link>
        )}
      </div>
    </aside>
  );
}
