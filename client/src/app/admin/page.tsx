"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import Avatar from "@/components/ui/Avatar";
import { adminService } from "@/services/adminService";
import { AdminStats, AdminLog } from "@/types/admin";
import {
  Users,
  FileSearch,
  Package,
  GitCompare,
  ClipboardCheck,
  Award,
  AlertTriangle,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, logsData] = await Promise.all([
        adminService.getStats(),
        adminService.getLogs(1, 8),
      ]);
      setStats(statsData);
      setLogs(logsData?.logs || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load admin dashboard statistics";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <Sidebar variant="admin" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
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
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 0 16px rgba(59,130,246,0.35)",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7" }}>
                Admin Control Center
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>
                Platform metrics, item moderation, claims & system health
              </p>
            </div>
          </div>

          <button
            onClick={fetchData}
            style={{
              padding: "8px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              color: "#A1A1AA",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
        </header>

        {/* Content Container */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {/* Top Stat Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "18px",
              marginBottom: "32px",
            }}
          >
            <StatCard
              title="Registered Users"
              value={stats?.users?.total ?? 0}
              icon={<Users size={20} />}
              trend="+12% this week"
              accentColor="#3B82F6"
            />
            <StatCard
              title="Lost Item Reports"
              value={stats?.items?.totalLost ?? 0}
              icon={<FileSearch size={20} />}
              trend="Active in pool"
              accentColor="#60A5FA"
            />
            <StatCard
              title="Found Item Reports"
              value={stats?.items?.totalFound ?? 0}
              icon={<Package size={20} />}
              trend="Awaiting owners"
              accentColor="#06B6D4"
            />
            <StatCard
              title="AI Match Pairs"
              value={stats?.matches?.total ?? 0}
              icon={<GitCompare size={20} />}
              trend={`${stats?.matches?.confirmed ?? 0} confirmed`}
              accentColor="#A855F7"
            />
            <StatCard
              title="Ownership Claims"
              value={stats?.claims?.total ?? 0}
              icon={<ClipboardCheck size={20} />}
              trend={`${stats?.claims?.pending ?? 0} pending review`}
              accentColor="#F59E0B"
            />
            <StatCard
              title="Reunited & Resolved"
              value={stats?.items?.resolved ?? 0}
              icon={<Award size={20} />}
              trend="Successful returns"
              accentColor="#10B981"
            />
          </div>

          {/* Activity Breakdown & Chart Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            {/* System Visual Breakdown Bar */}
            <div
              style={{
                background: "rgba(18,20,28,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "24px",
                backdropFilter: "blur(20px)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7", margin: 0 }}>
                    Platform Activity Distribution
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#A1A1AA", margin: "2px 0 0" }}>
                    Breakdown of lost vs. found vs. resolved items
                  </p>
                </div>
                <Activity size={18} color="#06B6D4" />
              </div>

              {/* Graphical Stacked Distribution */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div
                  style={{
                    height: "18px",
                    borderRadius: "999px",
                    overflow: "hidden",
                    display: "flex",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(
                        10,
                        ((stats?.items?.totalLost || 1) / ((stats?.items?.totalItems || 2) + 1)) * 100
                      )}%`,
                      background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                    }}
                    title="Lost Items"
                  />
                  <div
                    style={{
                      width: `${Math.max(
                        10,
                        ((stats?.items?.totalFound || 1) / ((stats?.items?.totalItems || 2) + 1)) * 100
                      )}%`,
                      background: "linear-gradient(90deg, #06B6D4, #22D3EE)",
                    }}
                    title="Found Items"
                  />
                  <div
                    style={{
                      width: `${Math.max(
                        5,
                        ((stats?.items?.resolved || 0) / ((stats?.items?.totalItems || 2) + 1)) * 100
                      )}%`,
                      background: "linear-gradient(90deg, #10B981, #34D399)",
                    }}
                    title="Resolved Items"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", fontSize: "0.78rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#60A5FA" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6" }} />
                    Lost: {stats?.items?.totalLost ?? 0}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22D3EE" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06B6D4" }} />
                    Found: {stats?.items?.totalFound ?? 0}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4ADE80" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
                    Resolved: {stats?.items?.resolved ?? 0}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FCD34D" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                    Flagged: {stats?.items?.flagged ?? 0}
                  </span>
                </div>
              </div>

              {/* Quick Action Navigation Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <Link
                  href="/admin/items"
                  style={{
                    padding: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: "#F5F5F7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                  }}
                >
                  <span>Manage Items</span>
                  <ArrowUpRight size={14} color="#60A5FA" />
                </Link>
                <Link
                  href="/admin/claims"
                  style={{
                    padding: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: "#F5F5F7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                  }}
                >
                  <span>Verify Claims</span>
                  <ArrowUpRight size={14} color="#06B6D4" />
                </Link>
              </div>
            </div>

            {/* Recent Audit Actions Feed */}
            <div
              style={{
                background: "rgba(18,20,28,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "24px",
                backdropFilter: "blur(20px)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F5F5F7", margin: 0 }}>
                  Recent Administrative Actions
                </h3>
                <span style={{ fontSize: "0.75rem", color: "#A1A1AA" }}>Audit Log</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "240px", overflowY: "auto" }}>
                {logs.length === 0 ? (
                  <p style={{ fontSize: "0.85rem", color: "#71717A", textAlign: "center", margin: "24px 0" }}>
                    No recent admin actions logged.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        borderRadius: "10px",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Avatar name={log.admin?.name || "Admin"} size="sm" />
                        <div>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#F5F5F7" }}>
                            {log.action.replace(/_/g, " ")}
                          </span>
                          <p style={{ fontSize: "0.72rem", color: "#A1A1AA", margin: 0 }}>
                            {log.details?.title || log.targetType}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "#71717A", flexShrink: 0 }}>
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
