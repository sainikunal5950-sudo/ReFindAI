"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ItemCard from "@/components/items/ItemCard";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import { foundItemService } from "@/services/foundItemService";
import { FoundItem } from "@/types/foundItem";
import {
  Search,
  PlusCircle,
  SlidersHorizontal,
  ChevronDown,
  PackageSearch,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Documents", "Bags", "Jewelry", "Clothing", "Keys", "Others"];

export default function FoundListingPage() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchItems = useCallback(
    async (targetPage = page) => {
      try {
        setLoading(true);
        const data = await foundItemService.getAllFoundItems({
          page: targetPage,
          limit: 9,
          category: activeCategory !== "All" ? activeCategory : undefined,
          location: location.trim() || undefined,
          status: status !== "all" ? status : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          search: search.trim() || undefined,
        });

        setItems(data?.items || []);
        setTotal(data?.total || 0);
        setPage(data?.page || 1);
        setTotalPages(data?.totalPages || 1);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load found items";
        setToast({ type: "error", message: msg });
      } finally {
        setLoading(false);
      }
    },
    [page, activeCategory, location, status, startDate, endDate, search]
  );

  useEffect(() => {
    fetchItems(1);
  }, [activeCategory, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setLocation("");
    setStatus("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#1E1425", color: "#F8F5F0" }}>
      <Navbar />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F5C842", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Found Registry
              </span>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F5C842", boxShadow: "0 0 8px #F5C842" }} />
              <span style={{ fontSize: "0.78rem", color: "#B8AEC2" }}>{total} items awaiting claim</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Browse{" "}
              <span style={{ background: "linear-gradient(135deg, #F5C842, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Found Items
              </span>
            </h1>
            <p style={{ color: "#B8AEC2", fontSize: "0.95rem", marginTop: "4px" }}>
              Items turned in by finders across your city. File a claim if you recognize yours.
            </p>
          </div>

          <Link
            href="/found/report"
            style={{
              padding: "12px 22px",
              background: "linear-gradient(135deg, #F5C842, #D4AF37)",
              borderRadius: "12px",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              boxShadow: "0 6px 24px rgba(245, 200, 66,0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <PlusCircle size={18} />
            Report Found Item
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          {/* Main Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search
              size={16}
              color="#606070"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
            <input
              type="text"
              placeholder="Search by title, location, description, or handover point..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#F8F5F0",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#F5C842";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 200, 66,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </form>

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              background: showFilters ? "rgba(245, 200, 66,0.15)" : "rgba(255,255,255,0.04)",
              border: showFilters ? "1px solid rgba(245, 200, 66,0.3)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: showFilters ? "#FDE047" : "#B8AEC2",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            <SlidersHorizontal size={15} />
            Filters
            <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showFilters && (
          <div
            style={{
              padding: "20px",
              background: "rgba(45, 27, 61,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              marginBottom: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "flex-end",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Location filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#B8AEC2" }}>Location / Area</label>
              <input
                type="text"
                placeholder="e.g. Times Square"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#F8F5F0",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#B8AEC2" }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#F8F5F0",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              >
                <option value="all" style={{ background: "#150E1C" }}>All Statuses</option>
                <option value="active" style={{ background: "#150E1C" }}>Active</option>
                <option value="matched" style={{ background: "#150E1C" }}>Matched</option>
                <option value="claimed" style={{ background: "#150E1C" }}>Claimed</option>
                <option value="closed" style={{ background: "#150E1C" }}>Closed</option>
              </select>
            </div>

            {/* Start Date */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#B8AEC2" }}>From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#F8F5F0",
                  fontSize: "0.85rem",
                  outline: "none",
                  colorScheme: "dark",
                }}
              />
            </div>

            {/* End Date */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#B8AEC2" }}>To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#F8F5F0",
                  fontSize: "0.85rem",
                  outline: "none",
                  colorScheme: "dark",
                }}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => fetchItems(1)}
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  background: "linear-gradient(135deg, #F5C842, #D4AF37)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#B8AEC2",
                  cursor: "pointer",
                }}
                title="Reset Filters"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", overflowX: "auto", paddingBottom: "4px" }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: isActive ? "linear-gradient(135deg, #F5C842, #D4AF37)" : "rgba(255,255,255,0.04)",
                  border: isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: isActive ? "#FFFFFF" : "#B8AEC2",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  boxShadow: isActive ? "0 4px 14px rgba(245, 200, 66,0.35)" : "none",
                  fontFamily: "inherit",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        {loading ? (
          /* Skeletons */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                style={{
                  height: "360px",
                  borderRadius: "20px",
                  background: "rgba(45, 27, 61,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                className="skeleton"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "rgba(45, 27, 61,0.4)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "24px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "rgba(245, 200, 66,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F5C842",
                margin: "0 auto 16px",
              }}
            >
              <PackageSearch size={32} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#F8F5F0", marginBottom: "6px" }}>
              No found items found
            </h3>
            <p style={{ color: "#B8AEC2", fontSize: "0.9rem", maxWidth: "380px", margin: "0 auto 24px" }}>
              No found items matched your active search terms or category filters.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                padding: "10px 20px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#F8F5F0",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {items.map((item) => (
              <ItemCard key={item._id || item.id} item={item} type="found" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "48px" }}>
            <button
              disabled={page <= 1 || loading}
              onClick={() => {
                const prev = page - 1;
                setPage(prev);
                fetchItems(prev);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: page <= 1 ? "#404050" : "#B8AEC2",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.85rem",
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isActive = p === page;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                    fetchItems(p);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: isActive ? "linear-gradient(135deg, #F5C842, #D4AF37)" : "rgba(255,255,255,0.04)",
                    border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: isActive ? "#FFFFFF" : "#B8AEC2",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={page >= totalPages || loading}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchItems(next);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: page >= totalPages ? "#404050" : "#B8AEC2",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.85rem",
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
