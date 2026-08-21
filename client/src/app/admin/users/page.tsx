"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import SidePanel from "@/components/ui/SidePanel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { userService } from "@/services/userService";
import { User } from "@/types/user";
import {
  Users as UsersIcon,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserX,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals & Panels
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async (targetPage = page) => {
    try {
      setLoading(true);
      const isBlockedVal =
        statusFilter === "active" ? false : statusFilter === "blocked" ? true : undefined;

      const data = await userService.getAllUsers({
        page: targetPage,
        limit: 10,
        role: roleFilter,
        isBlocked: isBlockedVal,
        search: search.trim() || undefined,
      });

      setUsers(data?.users || []);
      setTotal(data?.total || 0);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load users";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter, search]);

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    setIsSidePanelOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      await userService.deleteUser(userToDelete._id || (userToDelete as any).id);
      setToast({ type: "success", message: `User ${userToDelete.name} deleted successfully` });
      setUserToDelete(null);
      if (isSidePanelOpen && selectedUser?._id === userToDelete._id) {
        setIsSidePanelOpen(false);
      }
      fetchUsers(page);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete user";
      setToast({ type: "error", message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmBlock = async () => {
    if (!userToBlock) return;
    try {
      setActionLoading(true);
      const newStatus = !userToBlock.isBlocked;
      const res = await userService.toggleBlockUser(
        userToBlock._id || (userToBlock as any).id,
        newStatus
      );

      const statusText = newStatus ? "blocked" : "unblocked";
      setToast({ type: "success", message: `User ${userToBlock.name} ${statusText} successfully` });
      setUserToBlock(null);

      // Update in current users list
      setUsers((prev) =>
        prev.map((u) => (u._id === res.user._id ? { ...u, isBlocked: res.user.isBlocked } : u))
      );

      if (isSidePanelOpen && selectedUser?._id === res.user._id) {
        setSelectedUser(res.user);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update block status";
      setToast({ type: "error", message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <Sidebar variant="admin" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Side Panel for User Details */}
      <SidePanel
        isOpen={isSidePanelOpen}
        user={selectedUser}
        onClose={() => setIsSidePanelOpen(false)}
        onToggleBlock={(u) => setUserToBlock(u)}
        onDelete={(u) => setUserToDelete(u)}
        isActionLoading={actionLoading}
      />

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete ${userToDelete?.name}'s account (${userToDelete?.email})? This action cannot be undone.`}
        confirmText="Delete Account"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(userToBlock)}
        title={userToBlock?.isBlocked ? "Unblock User Account" : "Block User Account"}
        message={
          userToBlock?.isBlocked
            ? `Allow ${userToBlock?.name} (${userToBlock?.email}) to log in and use the platform again?`
            : `Block ${userToBlock?.name} (${userToBlock?.email})? They will be immediately logged out and prevented from signing in.`
        }
        confirmText={userToBlock?.isBlocked ? "Unblock User" : "Block User"}
        variant={userToBlock?.isBlocked ? "primary" : "warning"}
        isLoading={actionLoading}
        onConfirm={handleConfirmBlock}
        onCancel={() => setUserToBlock(null)}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Top Navbar */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "#FDF4D8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D4AF37",
              }}
            >
              <UsersIcon size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" }}>
                User Management
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#6B6B6B" }}>
                {total} total registered accounts
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchUsers(page)}
            style={{
              padding: "8px 14px",
              background: "#F9FAFB",
              border: "1px solid #F9FAFB",
              borderRadius: "10px",
              color: "#6B6B6B",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#6B6B6B")}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </header>

        {/* Body */}
        <div style={{ flex: 1, padding: "32px" }}>
          {/* Controls Bar: Search & Filters */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F9FAFB",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              gap: "14px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: "240px", position: "relative" }}>
              <Search
                size={16}
                color="#606070"
                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 42px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  borderRadius: "10px",
                  color: "#1A1A1A",
                  fontSize: "0.88rem",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.boxShadow = "0 0 0 2px #FDF4D8";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#F9FAFB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </form>

            {/* Role Filter */}
            <div style={{ position: "relative" }}>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: "10px 34px 10px 14px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  borderRadius: "10px",
                  color: "#6B6B6B",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  appearance: "none",
                }}
              >
                <option value="all" style={{ background: "#FFFFFF" }}>All Roles</option>
                <option value="user" style={{ background: "#FFFFFF" }}>User</option>
                <option value="admin" style={{ background: "#FFFFFF" }}>Admin</option>
              </select>
              <ChevronDown size={14} color="#606070" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            {/* Status Filter */}
            <div style={{ position: "relative" }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "10px 34px 10px 14px",
                  background: "#F9FAFB",
                  border: "1px solid #F9FAFB",
                  borderRadius: "10px",
                  color: "#6B6B6B",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  appearance: "none",
                }}
              >
                <option value="all" style={{ background: "#FFFFFF" }}>All Statuses</option>
                <option value="active" style={{ background: "#FFFFFF" }}>Active</option>
                <option value="blocked" style={{ background: "#FFFFFF" }}>Blocked</option>
              </select>
              <ChevronDown size={14} color="#606070" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Table Container */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F9FAFB",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {loading ? (
              /* Table Skeleton */
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} style={{ height: "48px", borderRadius: "10px" }} className="skeleton" />
                ))}
              </div>
            ) : users.length === 0 ? (
              /* Empty State */
              <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "#FDF4D8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D4AF37",
                    marginBottom: "16px",
                  }}
                >
                  <UserX size={28} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "6px" }}>
                  No users found
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#6B6B6B", maxWidth: "340px" }}>
                  No registered accounts matched your active filters or search terms.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F9FAFB" }}>
                      <th style={{ padding: "14px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#606070", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        User
                      </th>
                      <th style={{ padding: "14px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#606070", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Email
                      </th>
                      <th style={{ padding: "14px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#606070", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Role
                      </th>
                      <th style={{ padding: "14px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#606070", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Status
                      </th>
                      <th style={{ padding: "14px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#606070", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Joined Date
                      </th>
                      <th style={{ padding: "14px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#606070", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "right" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id || (u as any).id}
                        style={{
                          borderBottom: "1px solid #F9FAFB",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212, 175, 55,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {/* User / Avatar + Name */}
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Avatar src={u.avatar} name={u.name} size="sm" glow={false} />
                            <div>
                              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1A1A1A", display: "block" }}>
                                {u.name}
                              </span>
                              {u.phone && (
                                <span style={{ fontSize: "0.74rem", color: "#606070" }}>{u.phone}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: "14px 20px", fontSize: "0.85rem", color: "#6B6B6B" }}>
                          {u.email}
                        </td>

                        {/* Role */}
                        <td style={{ padding: "14px 20px" }}>
                          <Badge variant={u.role === "admin" ? "blue" : "neutral"}>
                            {u.role.toUpperCase()}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "14px 20px" }}>
                          <Badge variant={u.isBlocked ? "rejected" : "approved"} dot={!u.isBlocked}>
                            {u.isBlocked ? "BLOCKED" : "ACTIVE"}
                          </Badge>
                        </td>

                        {/* Joined Date */}
                        <td style={{ padding: "14px 20px", fontSize: "0.82rem", color: "#606070" }}>
                          {formatDate(u.createdAt)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            {/* View details */}
                            <button
                              title="View Details"
                              onClick={() => handleOpenDetails(u)}
                              style={{
                                padding: "6px 10px",
                                background: "#FDF4D8",
                                border: "1px solid #E5E5E5",
                                borderRadius: "8px",
                                color: "#92700F",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#E5E5E5")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FDF4D8")}
                            >
                              <Eye size={14} />
                            </button>

                            {/* Block / Unblock */}
                            <button
                              title={u.isBlocked ? "Unblock Account" : "Block Account"}
                              onClick={() => setUserToBlock(u)}
                              style={{
                                padding: "6px 10px",
                                background: u.isBlocked ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                                border: u.isBlocked
                                  ? "1px solid rgba(34,197,94,0.25)"
                                  : "1px solid rgba(245,158,11,0.25)",
                                borderRadius: "8px",
                                color: u.isBlocked ? "#4ADE80" : "#FCD34D",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                            >
                              {u.isBlocked ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                            </button>

                            {/* Delete */}
                            <button
                              title="Delete Account"
                              onClick={() => setUserToDelete(u)}
                              style={{
                                padding: "6px 10px",
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.25)",
                                borderRadius: "8px",
                                color: "#F87171",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.2)")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)")}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid #F9FAFB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "#606070" }}>
                  Showing page {page} of {totalPages} ({total} users)
                </span>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => {
                      const nextP = page - 1;
                      setPage(nextP);
                      fetchUsers(nextP);
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "#F9FAFB",
                      border: "1px solid #F9FAFB",
                      color: page <= 1 ? "#404050" : "#6B6B6B",
                      cursor: page <= 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.82rem",
                    }}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    const isActive = pNum === page;
                    return (
                      <button
                        key={pNum}
                        onClick={() => {
                          setPage(pNum);
                          fetchUsers(pNum);
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: isActive
                            ? "linear-gradient(135deg, #D4AF37, #F5C842)"
                            : "#F9FAFB",
                          border: isActive ? "none" : "1px solid #F9FAFB",
                          color: isActive ? "#FFFFFF" : "#6B6B6B",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                        }}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages || loading}
                    onClick={() => {
                      const nextP = page + 1;
                      setPage(nextP);
                      fetchUsers(nextP);
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "#F9FAFB",
                      border: "1px solid #F9FAFB",
                      color: page >= totalPages ? "#404050" : "#6B6B6B",
                      cursor: page >= totalPages ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.82rem",
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
