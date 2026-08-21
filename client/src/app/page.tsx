"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  Bell,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: <Cpu size={24} />,
    title: "AI Matching Engine",
    desc: "Computer vision and NLP compare descriptions, images, and context to find the best matches automatically.",
    color: "#3B82F6",
  },
  {
    icon: <MapPin size={24} />,
    title: "Location-Aware",
    desc: "Search within a custom radius — items are matched with nearby reports first for faster recovery.",
    color: "#06B6D4",
  },
  {
    icon: <Bell size={24} />,
    title: "Instant Alerts",
    desc: "Get notified the moment a match is found. Real-time push notifications keep you in the loop.",
    color: "#3B82F6",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Secure Claims",
    desc: "Verified identity checks and secure claim workflows protect both reporters and finders.",
    color: "#06B6D4",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Report Your Item",
    desc: "Describe what you lost or found — add photos, location, and a detailed description.",
  },
  {
    step: "02",
    title: "AI Finds Matches",
    desc: "Our engine scans all reports and surfaces the best matches ranked by confidence score.",
  },
  {
    step: "03",
    title: "Claim & Recover",
    desc: "Connect securely with the finder, verify ownership, and recover your item.",
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#F5F5F7",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* ── Animated Background ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
            top: "-180px",
            left: "-120px",
            animation: "float 10s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)",
            bottom: "0",
            right: "-100px",
            animation: "float2 13s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
            top: "40%",
            left: "35%",
            animation: "float 16s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,15,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 32px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 18px rgba(59,130,246,0.4)",
              }}
            >
              <Search size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ReFind
            </span>
          </Link>

          {/* Links */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }} className="nav-links-desktop">
            {[
              { href: "/lost", label: "Report Lost" },
              { href: "/found", label: "Report Found" },
              { href: "/dashboard", label: "Dashboard" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  color: "#A1A1AA",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5F5F7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#A1A1AA")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href="/login"
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                color: "#A1A1AA",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
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
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                transition: "all 0.2s",
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
              <Sparkles size={14} />
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "100px 32px 80px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "999px",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#60A5FA",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 8px #22C55E",
              animation: "pulse-dot 2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          AI-Powered Matching Engine · Live
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.6rem, 7vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: "28px",
          }}
        >
          From Lost to Found,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Intelligently
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "1.15rem",
            color: "#A1A1AA",
            lineHeight: 1.75,
            maxWidth: "600px",
            margin: "0 auto 48px",
          }}
        >
          ReFind uses cutting-edge AI to match lost items with found reports —
          combining computer vision, NLP, and location data to reunite people
          with their belongings faster than ever.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "72px",
          }}
        >
          <Link
            href="/lost"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 36px",
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              borderRadius: "14px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
              transition: "all 0.25s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 48px rgba(59,130,246,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(59,130,246,0.4)";
            }}
          >
            <Search size={18} />
            Report a Lost Item
          </Link>
          <Link
            href="/found"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 36px",
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              color: "#F5F5F7",
              fontWeight: 700,
              fontSize: "1rem",
              backdropFilter: "blur(10px)",
              transition: "all 0.25s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(59,130,246,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <CheckCircle size={18} />
            Report a Found Item
          </Link>
        </div>

        {/* Stats Bar */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
          }}
        >
          {[
            { icon: <TrendingUp size={18} />, num: "10K+", label: "Items Recovered" },
            { icon: <Cpu size={18} />, num: "94%", label: "Match Accuracy" },
            { icon: <Clock size={18} />, num: "48h", label: "Avg. Recovery" },
            { icon: <Users size={18} />, num: "5K+", label: "Active Users" },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "24px 40px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <span style={{ color: "#3B82F6", marginBottom: "4px" }}>{s.icon}</span>
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#A1A1AA", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#3B82F6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            How It Works
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Three steps to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              recovery
            </span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {howItWorks.map((step, i) => (
            <div
              key={step.step}
              style={{
                padding: "36px 28px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(59,130,246,0.06)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.25)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(59,130,246,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Step Number */}
              <div
                style={{
                  fontSize: "4rem",
                  fontWeight: 900,
                  color: "rgba(59,130,246,0.08)",
                  position: "absolute",
                  top: "16px",
                  right: "20px",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                }}
              >
                {step.step}
              </div>

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.2))",
                  border: "1px solid rgba(59,130,246,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: "#3B82F6",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                {i + 1}
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px", color: "#F5F5F7" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#A1A1AA", lineHeight: 1.7 }}>{step.desc}</p>

              {i < 2 && (
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                  <ArrowRight size={16} color="#3B82F6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 32px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#06B6D4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            Features
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Built for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              real results
            </span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "32px 28px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(59,130,246,0.05)";
                (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${f.color === "#3B82F6" ? "59,130,246" : "6,182,212"},0.3)`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(${f.color === "#3B82F6" ? "59,130,246" : "6,182,212"},0.12)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: `rgba(${f.color === "#3B82F6" ? "59,130,246" : "6,182,212"},0.12)`,
                  border: `1px solid rgba(${f.color === "#3B82F6" ? "59,130,246" : "6,182,212"},0.25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: f.color,
                  marginBottom: "20px",
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7", marginBottom: "10px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#A1A1AA", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1100px",
          margin: "0 auto 80px",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            padding: "64px 48px",
            background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.08))",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "28px",
            backdropFilter: "blur(16px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow behind */}
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "16px", position: "relative" }}>
            Ready to find what you&apos;ve lost?
          </h2>
          <p style={{ color: "#A1A1AA", fontSize: "1rem", marginBottom: "36px", maxWidth: "480px", margin: "0 auto 36px", position: "relative" }}>
            Join thousands of users who&apos;ve recovered their belongings using ReFind&apos;s intelligent platform.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <Link
              href="/register"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
                transition: "all 0.25s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 48px rgba(59,130,246,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(59,130,246,0.4)";
              }}
            >
              <Sparkles size={16} />
              Start for Free
            </Link>
            <Link
              href="/lost"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                color: "#F5F5F7",
                fontWeight: 700,
                fontSize: "1rem",
                transition: "all 0.25s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#60A5FA";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#F5F5F7";
              }}
            >
              <Search size={16} />
              Browse Lost Items
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 5,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={13} color="#fff" />
            </div>
            <span
              style={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ReFind
            </span>
          </div>
          <span style={{ color: "#606070", fontSize: "0.85rem" }}>
            © 2026 ReFind. Built with ♥ and AI.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <Link key={l} href="#" style={{ color: "#606070", fontSize: "0.85rem", transition: "color 0.2s", textDecoration: "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#3B82F6")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#606070")}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
