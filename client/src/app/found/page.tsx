"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Badge from "@/components/ui/Badge";
import { Search, MapPin, Calendar, SlidersHorizontal, ChevronDown, PackageCheck } from "lucide-react";

const categories = ["All", "Electronics", "Bags", "Clothing", "Jewelry", "Keys", "Documents", "Other"];

const foundItems = [
  { id: 1, title: "Silver iPhone Found at Subway", category: "Electronics", location: "42nd St Station, NY", date: "Aug 19, 2026", score: 89, desc: "Found a silver iPhone on the platform. Screen intact, no visible damage. Handed to station staff initially.", gradients: ["#6366F1", "#3B82F6"] },
  { id: 2, title: "Brown Leather Briefcase", category: "Bags", location: "Penn Station, NY", date: "Aug 18, 2026", score: 74, desc: "Large brown leather briefcase left on a bench. Contains papers and a charger. No ID found inside.", gradients: ["#78350F", "#B45309"] },
  { id: 3, title: "Child's Red Backpack", category: "Bags", location: "Central Park Zoo", date: "Aug 17, 2026", score: 67, desc: "Small red backpack with Peppa Pig print. Contains kids books and a water bottle. Please claim soon.", gradients: ["#DC2626", "#F87171"] },
  { id: 4, title: "Set of House Keys + Keychain", category: "Keys", location: "Times Square Starbucks", date: "Aug 16, 2026", score: 91, desc: "Found a key ring with 4 house keys and a mini NY taxi keychain. Left at the counter near exit.", gradients: ["#0D9488", "#06B6D4"] },
  { id: 5, title: "Yellow Tote Bag", category: "Bags", location: "High Line Park, NY", date: "Aug 15, 2026", score: 58, desc: "Bright yellow canvas tote bag with various items inside including sunglasses and a book.", gradients: ["#CA8A04", "#EAB308"] },
  { id: 6, title: "Prescription Glasses", category: "Other", location: "Brooklyn Library", date: "Aug 14, 2026", score: 82, desc: "Black frame prescription glasses in a hard case. Left at the reading room table near window.", gradients: ["#374151", "#6B7280"] },
  { id: 7, title: "Apple Watch Series 9", category: "Electronics", location: "Chelsea Market", date: "Aug 13, 2026", score: 95, desc: "Space gray Apple Watch with a black sport band. Screen undamaged. Found near the food court area.", gradients: ["#1E3A5F", "#3B82F6"] },
  { id: 8, title: "Blue Denim Jacket", category: "Clothing", location: "Madison Square Garden", date: "Aug 12, 2026", score: 63, desc: "Medium-sized blue denim jacket with concert patches. Has initials 'MR' written on the label.", gradients: ["#1D4ED8", "#60A5FA"] },
];

export default function FoundPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = foundItems.filter((item) => {
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
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#06B6D4", letterSpacing: "0.1em", textTransform: "uppercase" }}>Found Items</span>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#06B6D4", boxShadow: "0 0 8px #06B6D4" }} />
            <span style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>{filtered.length} items listed</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Browse{" "}
            <span style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Found Items
            </span>
          </h1>
          <p style={{ color: "#A1A1AA", fontSize: "0.95rem" }}>
            Someone found something that might be yours. Check if your item is listed.
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
                e.currentTarget.style.borderColor = "#06B6D4";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.12)";
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
                background: activeCategory === cat ? "linear-gradient(135deg, #06B6D4, #3B82F6)" : "rgba(255,255,255,0.04)",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: activeCategory === cat ? "#fff" : "#A1A1AA",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                boxShadow: activeCategory === cat ? "0 4px 14px rgba(6,182,212,0.35)" : "none",
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
            const [c1, c2] = item.gradients;
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
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(6,182,212,0.12)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.25)";
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
                  <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `linear-gradient(135deg, ${c1}, ${c2})`, opacity: 0.7, boxShadow: `0 8px 24px ${c1}40` }} />

                  {/* Match Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "5px 12px",
                      background: "rgba(10,10,15,0.85)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "999px",
                      border: "1px solid rgba(6,182,212,0.3)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#22D3EE",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#06B6D4", boxShadow: "0 0 6px #06B6D4" }} />
                    {item.score}% Match
                  </div>

                  {/* Found tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "4px 10px",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      borderRadius: "999px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#4ADE80",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <PackageCheck size={11} />
                    FOUND
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                    <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F5F5F7", lineHeight: 1.35 }}>{item.title}</h2>
                    <Badge variant="cyan">{item.category}</Badge>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "#A1A1AA", lineHeight: 1.6, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.desc}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#A1A1AA", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={11} />{item.location}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#606070", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={11} />{item.date}
                      </span>
                    </div>
                    <button
                      style={{
                        padding: "8px 16px",
                        background: "rgba(6,182,212,0.08)",
                        border: "1px solid rgba(6,182,212,0.25)",
                        borderRadius: "8px",
                        color: "#22D3EE",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.15)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 14px rgba(6,182,212,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      Claim Item
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#A1A1AA" }}>
            <PackageCheck size={48} color="#06B6D430" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#F5F5F7", marginBottom: "8px" }}>No items found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );
}
