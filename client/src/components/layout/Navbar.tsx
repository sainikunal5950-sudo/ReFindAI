"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MapPin, Menu, X, Zap } from "lucide-react";

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
            ? "rgba(10,10,15,0.85)"
            : "rgba(10,10,15,0.4)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
          borderBottom: scrolled
            ? "1px solid rgba(59,130,246,0.15)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
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
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(59,130,246,0.4)",
              }}
            >
              <Search size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
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
                    color: active ? "#3B82F6" : "#A1A1AA",
                    background: active ? "rgba(59,130,246,0.1)" : "transparent",
                    border: active ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#F5F5F7";
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#A1A1AA";
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
            <Link
              href="/login"
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#A1A1AA",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5F5F7";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#A1A1AA";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
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
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                transition: "all 0.2s ease",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(59,130,246,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(59,130,246,0.35)";
              }}
            >
              <Zap size={14} />
              Get Started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#A1A1AA",
                cursor: "pointer",
                padding: "8px",
              }}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(10,10,15,0.95)",
              padding: "12px 24px 20px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  color: pathname === link.href ? "#3B82F6" : "#A1A1AA",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <Link
                href="/login"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F5F5F7",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Log In
              </Link>
              <Link
                href="/register"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
