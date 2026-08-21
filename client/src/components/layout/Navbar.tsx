"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MapPin, Menu, X, Zap } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";

const navLinks = [
  { href: "/lost", label: "Report Lost" },
  { href: "/found", label: "Report Found" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          background: scrolled
            ? "#FFFFFF"
            : "#FFFFFF",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid #E5E5E5"
            : "1px solid #F9FAFB",
          boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #D4AF37, #F5C842)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(212,175,55,0.45)",
              }}
            >
              <Search size={18} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #1A1A1A, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.01em",
              }}
            >
              ReFind
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              flex: 1,
              justifyContent: "center",
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: active ? "#F5C842" : "#6B6B6B",
                    background: active ? "#FDF4D8" : "transparent",
                    border: active ? "1px solid #F5E5B8" : "1px solid transparent",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A1A";
                      (e.currentTarget as HTMLAnchorElement).style.background = "#F9FAFB";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#6B6B6B";
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <NotificationBell />
            <Link
              href="/login"
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1A1A1A",
                border: "1px solid #F5E5B8",
                background: "rgba(212,175,55,0.04)",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5C842";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.6)";
                (e.currentTarget as HTMLAnchorElement).style.background = "#FDF4D8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A1A";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#F5E5B8";
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.04)";
              }}
            >
              Log In
            </Link>
            <Link
              href="/register"
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#FFFFFF",
                background: "linear-gradient(135deg, #D4AF37, #EAB308)",
                boxShadow: "0 4px 16px #F5E5B8",
                transition: "all 0.2s ease",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(212,175,55,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px #F5E5B8";
              }}
            >
              <Zap size={15} color="#FFFFFF" /> Get Started
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              style={{
                display: "none",
                padding: "8px",
                borderRadius: "8px",
                background: "#F9FAFB",
                border: "1px solid #F3F4F6",
                color: "#1A1A1A",
                cursor: "pointer",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "68px",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid #E5E5E5",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: 600,
                color: pathname === link.href ? "#D4AF37" : "#1A1A1A",
                background: pathname === link.href ? "#FDF4D8" : "#F9FAFB",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
