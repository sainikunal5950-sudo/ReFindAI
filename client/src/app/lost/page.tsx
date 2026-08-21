"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Badge from "@/components/ui/Badge";
import { Search, MapPin, Calendar, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

const categories = ["All", "Electronics", "Bags", "Clothing", "Jewelry", "Keys", "Documents", "Other"];

const lostItems = [
  { id: 1, title: "iPhone 13 Pro (Space Gray)", category: "Electronics", location: "Central Park, NY", date: "Aug 18, 2026", score: 92, desc: "Space gray iPhone 13 Pro with cracked screen protector. Has a dark blue case with gold initials 'JD'.", color: "from-blue-600 to-cyan-500" },
  { id: 2, title: "Blue North Face Backpack", category: "Bags", location: "Brooklyn Bridge, NY", date: "Aug 17, 2026", score: 78, desc: "Large 40L blue North Face backpack with a red keychain and laptop inside. Left at the subway station.", color: "from-indigo-600 to-blue-500" },
  { id: 3, title: "AirPods Pro (White)", category: "Electronics", location: "Times Square, NY", date: "Aug 16, 2026", score: 71, desc: "White AirPods Pro with charging case. Case has a small scratch on the lid and sticker on the bottom.", color: "from-cyan-600 to-teal-500" },
  { id: 4, title: "Black Leather Wallet", category: "Bags", location: "Grand Central, NY", date: "Aug 15, 2026", score: 65, desc: "Slim black leather bifold wallet with ID cards and credit cards inside. Has a photo of family.", color: "from-slate-600 to-slate-500" },
  { id: 5, title: "Sony WH-1000XM5 Headphones", category: "Electronics", location: "JFK Airport, NY", date: "Aug 14, 2026", score: 88, desc: "Black Sony over-ear headphones. Missing from terminal 4. Has name written inside the band.", color: "from-blue-700 to-blue-500" },
  { id: 6, title: "Gold Ring with Diamond", category: "Jewelry", location: "Central Park, NY", date: "Aug 13, 2026", score: 55, desc: "Yellow gold engagement ring with single round diamond. Very sentimental. Lost during morning run.", color: "from-amber-600 to-yellow-500" },
  { id: 7, title: "Car Keys — Honda Civic", category: "Keys", location: "Parking Lot B, Queens", date: "Aug 12, 2026", score: 82, desc: "Honda car key fob with a small bottle opener keychain. Black plastic with red Honda logo.", color: "from-red-700 to-red-500" },
  { id: 8, title: "Passport (Indian)", category: "Documents", location: "LaGuardia Airport", date: "Aug 11, 2026", score: 96, desc: "Blue Indian passport. Very urgent recovery needed. Has multiple international visas inside.", color: "from-green-700 to-emerald-500" },
];

const gradients: Record<number, string[]> = {
  1: ["#3B82F6", "#06B6D4"],
  2: ["#6366F1", "#3B82F6"],
  3: ["#06B6D4", "#0D9488"],
  4: ["#475569", "#64748B"],
  5: ["#2563EB", "#3B82F6"],
  6: ["#D97706", "#EAB308"],
  7: ["#DC2626", "#EF4444"],
  8: ["#16A34A", "#10B981"],
};

export default function LostPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = lostItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F5F5F7" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 32px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#3B82F6", letterSpacing: "0.1em", textTransform: "uppercase" }}>Lost Items</span>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
            <span style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>{filtered.length} items found</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Browse{" "}
            <span style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Lost Items
            </span>
          </h1>
          <p style={{ color: "#A1A1AA", fontSize: "0.95rem" }}>
            Help reunite people with their belongings. Browse or search below.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search size={16} color="#606070" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search by item or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#F5F5F7",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3B82F6";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#A1A1AA", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            <Calendar size={15} />
            Date Range
            <ChevronDown size={14} />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#A1A1AA", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", overflowX: "auto", paddingBottom: "4px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                background: activeCategory === cat ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : "rgba(255,255,255,0.04)",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: activeCategory === cat ? "#fff" : "#A1A1AA",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                boxShadow: activeCategory === cat ? "0 4px 14px rgba(59,130,246,0.35)" : "none",
                fontFamily: "inherit",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filtered.map((item) => {
            const [c1, c2] = gradients[item.id] || ["#3B82F6", "#06B6D4"];
            return (
              <article
                key={item.id}
                style={{
                  background: "rgba(18,20,28,0.9)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(59,130,246,0.15)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                {/* Image Placeholder */}
                <div
                  style={{
                    height: "160px",
                    background: `linear-gradient(135deg, ${c1}30, ${c2}20)`,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "18px",
                      background: `linear-gradient(135deg, ${c1}, ${c2})`,
                      opacity: 0.7,
                      boxShadow: `0 8px 24px ${c1}40`,
                    }}
                  />
                  {/* Match Score Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "5px 12px",
                      background: "rgba(10,10,15,0.85)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "999px",
                      border: "1px solid rgba(59,130,246,0.3)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#60A5FA",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }} />
                    {item.score}% Match
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                    <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F5F5F7", lineHeight: 1.35 }}>{item.title}</h2>
                    <Badge variant="blue">{item.category}</Badge>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "#A1A1AA", lineHeight: 1.6, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.desc}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#A1A1AA", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={11} />
                        {item.location}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#606070", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={11} />
                        {item.date}
                      </span>
                    </div>
                    <button
                      style={{
                        padding: "8px 16px",
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        borderRadius: "8px",
                        color: "#60A5FA",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.2)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 14px rgba(59,130,246,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.1)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#A1A1AA" }}>
            <Search size={48} color="#3B82F630" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#F5F5F7", marginBottom: "8px" }}>No items found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );
}
