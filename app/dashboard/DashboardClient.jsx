"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { projectService } from "@/lib/projectService";
import { roomSelectionData } from "@/lib/data";

export default function DashboardClient() {
  const router = useRouter();
  const { user, loading: authLoading, logout, updateProfile } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects"); // "projects", "settings"

  // Profile Edit fields
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal actions
  const [activeModal, setActiveModal] = useState(null); // null, "rename", "delete", "share"
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectNameInput, setProjectNameInput] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setEditName(user.name);
    }
  }, [user]);

  // Load user's projects
  const fetchUserProjects = async () => {
    if (!user) return;
    try {
      const data = await projectService.getAllProjects(user.id);
      setProjects(data);
    } catch (e) {
      console.error("Failed to load user projects:", e);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setSettingsSuccess("");
    setSettingsError("");

    if (!editName.trim()) {
      setSettingsError("Name cannot be empty.");
      return;
    }

    if (editPassword && editPassword.length < 6) {
      setSettingsError("Password must be at least 6 characters long.");
      return;
    }

    if (editPassword && editPassword !== confirmPassword) {
      setSettingsError("Passwords do not match.");
      return;
    }

    setSavingSettings(true);
    try {
      const updates = { name: editName };
      if (editPassword) {
        updates.password = editPassword;
      }
      await updateProfile(updates);
      setSettingsSuccess("Profile settings updated successfully!");
      setEditPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSettingsError(err.message || "Failed to update profile.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Duplicate / Rename / Delete Handlers (reused from projects client)
  const handleOpenRename = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setProjectNameInput(project.name);
    setActiveModal("rename");
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!projectNameInput.trim() || !selectedProject) return;
    setActionLoading(true);
    try {
      await projectService.renameProject(selectedProject.id, projectNameInput);
      await fetchUserProjects();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDelete = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setActiveModal("delete");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      await projectService.deleteProject(selectedProject.id);
      await fetchUserProjects();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActionLoading(true);
    try {
      await projectService.duplicateProject(projectId, user?.id);
      await fetchUserProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenShare = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    const encoded = projectService.encodeShareLink(project.designData);
    if (encoded) {
      const shareUrl = `${window.location.origin}/designer?share=${encoded}`;
      setShareLink(shareUrl);
      setSelectedProject(project);
      setActiveModal("share");
      setCopied(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getProjectStats = (project) => {
    const data = project.designData;
    if (!data) return { roomsCount: 0, primaryRoomType: "living-room" };
    const rooms = data.roomsList || [];
    return {
      roomsCount: rooms.length || 1,
      primaryRoomType: rooms.length > 0 ? rooms[0].type : (data.selectedRoom?.slug || "living-room"),
    };
  };

  const getRoomImage = (type) => {
    const matched = roomSelectionData.find((r) => r.slug === type);
    return matched?.image || "/images/living-room.jpg";
  };

  // If loading user or not logged in yet, render loading spinner
  if (authLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-65px)] w-full flex-col items-center justify-center bg-cream gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-brand-700" />
        <p className="text-xs text-stone-500">Redirecting to login dashboard...</p>
      </div>
    );
  }

  // Count metrics for stats cards
  const totalProjectsCount = projects.length;
  const multiRoomProjectsCount = projects.filter((p) => (p.designData?.roomsList?.length || 0) > 1).length;
  const latestProjectName = projects[0]?.name || "None";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-8 shadow-xl mb-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(139,115,85,0.2),transparent)]" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white text-xl font-bold font-display shadow-md">
              {getInitials(user.name)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-white tracking-tight sm:text-3xl">
                Hello, {user.name}
              </h1>
              <p className="mt-1 text-xs text-stone-400">
                Registered Email: {user.email} · Member since: {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-stone-700 bg-stone-800/80 px-5 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white transition-all shrink-0 self-start sm:self-center"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Saved Designs</p>
          <p className="mt-2 text-3xl font-bold font-display text-stone-900">{totalProjectsCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Multi-Room Layouts</p>
          <p className="mt-2 text-3xl font-bold font-display text-stone-900">{multiRoomProjectsCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm min-w-0">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Recent Project</p>
          <p className="mt-2 text-lg font-semibold text-stone-900 truncate" title={latestProjectName}>
            {latestProjectName}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "projects"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-stone-400 hover:text-stone-600"
          }`}
        >
          My Saved Designs
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-stone-400 hover:text-stone-600"
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Projects List Tab */}
      {activeTab === "projects" && (
        <div>
          {projectsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-brand-700" />
              <p className="text-xs text-stone-500">Loading saved designs...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const stats = getProjectStats(project);
                return (
                  <Link
                    key={project.id}
                    href={`/designer?project=${project.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:border-brand-300 hover:shadow-md transition-all duration-305"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-40 w-full bg-stone-100 overflow-hidden">
                      <img
                        src={getRoomImage(stats.primaryRoomType)}
                        alt={project.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      
                      {/* Rooms count tag */}
                      <div className="absolute bottom-3 left-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        {stats.roomsCount} {stats.roomsCount === 1 ? "Room" : "Rooms"}
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base font-semibold text-stone-900 group-hover:text-brand-700 transition-colors truncate">
                        {project.name}
                      </h3>
                      
                      <div className="mt-auto border-t border-stone-100 pt-4 flex flex-col gap-1 text-[10px] text-stone-400">
                        <div className="flex justify-between">
                          <span>Last edited:</span>
                          <span className="font-semibold text-stone-500">{formatDate(project.updatedAt)}</span>
                        </div>
                      </div>
                      
                      {/* Actions overlay */}
                      <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-stone-50 pt-3.5">
                        <button
                          onClick={(e) => handleOpenRename(project, e)}
                          className="rounded-lg p-1.5 text-stone-450 hover:bg-stone-55 hover:text-stone-700 transition-colors"
                          title="Rename Design"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={(e) => handleDuplicate(project.id, e)}
                          className="rounded-lg p-1.5 text-stone-450 hover:bg-stone-55 hover:text-stone-700 transition-colors"
                          title="Duplicate Design"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={(e) => handleOpenShare(project, e)}
                          className="rounded-lg p-1.5 text-stone-450 hover:bg-stone-55 hover:text-stone-700 transition-colors"
                          title="Share Design Link"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318M8.684 13.258l4.636 2.318m6-4.161a3 3 0 11-6 0 3 3 0 016 0zm-6-5a3 3 0 11-6 0 3 3 0 016 0zm6 10a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>

                        <span className="h-4 w-px bg-stone-100 mx-1" />

                        <button
                          onClick={(e) => handleOpenDelete(project, e)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-650 transition-colors ml-auto"
                          title="Delete Design"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 text-2xl shadow-inner mb-4">
                📂
              </div>
              <h3 className="font-display text-base font-semibold text-stone-900">
                No designs saved yet
              </h3>
              <p className="mt-2 text-xs text-stone-500 max-w-sm">
                Get started on the design studio, choose rooms, style palettes, and build your dream layout!
              </p>
              <Link
                href="/select-room"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-800 transition-colors"
              >
                Create First Design
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === "settings" && (
        <div className="max-w-xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-stone-900 mb-6">
            Edit Profile Credentials
          </h2>

          {settingsSuccess && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{settingsSuccess}</span>
            </div>
          )}

          {settingsError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-650 flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{settingsError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfileSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="settings-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                Email Address <span className="text-[10px] font-normal text-stone-400">(Read-Only)</span>
              </label>
              <input
                id="settings-email"
                type="email"
                disabled
                value={user.email}
                className="w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-2.5 text-sm text-stone-500 cursor-not-allowed outline-none"
              />
            </div>

            <hr className="border-stone-100 my-2" />

            <div>
              <label htmlFor="settings-password" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                New Password <span className="text-[10px] font-normal text-stone-400">(Leave blank to keep current)</span>
              </label>
              <input
                id="settings-password"
                type="password"
                placeholder="Min. 6 characters"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="settings-confirm" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Confirm New Password
              </label>
              <input
                id="settings-confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-800 focus:outline-none active:scale-98 transition-all gap-1.5"
            >
              {savingSettings && <div className="h-3.5 w-3.5 animate-spin rounded-full border border-white border-t-transparent" />}
              Save Updates
            </button>
          </form>
        </div>
      )}

      {/* ── Modals Overlay ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-display text-base font-semibold text-stone-900">
                {activeModal === "rename" && "Rename Project"}
                {activeModal === "delete" && "Delete Project"}
                {activeModal === "share" && "Share Design"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-colors"
                aria-label="Close dialog"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Rename */}
            {activeModal === "rename" && (
              <form onSubmit={handleRenameSubmit} className="mt-4 flex flex-col gap-4">
                <div>
                  <label htmlFor="modal-project-name" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Project Name
                  </label>
                  <input
                    id="modal-project-name"
                    type="text"
                    required
                    maxLength={30}
                    value={projectNameInput}
                    onChange={(e) => setProjectNameInput(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                    autoFocus
                  />
                </div>
                
                <div className="flex items-center justify-end gap-2 border-t border-stone-50 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    disabled={actionLoading}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all active:scale-95 flex items-center gap-1"
                  >
                    {actionLoading && <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />}
                    Rename
                  </button>
                </div>
              </form>
            )}

            {/* Modal Body: Delete */}
            {activeModal === "delete" && (
              <div className="mt-4 flex flex-col gap-4">
                <p className="text-sm text-stone-650 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-stone-900">"{selectedProject?.name}"</span>? This action cannot be undone and will permanently remove this design from your dashboard.
                </p>
                
                <div className="flex items-center justify-end gap-2 border-t border-stone-50 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    disabled={actionLoading}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-55 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={actionLoading}
                    className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-755 transition-all active:scale-95 flex items-center gap-1"
                  >
                    {actionLoading && <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />}
                    Delete Project
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Share Link */}
            {activeModal === "share" && (
              <div className="mt-4 flex flex-col gap-4">
                <p className="text-xs text-stone-555 leading-relaxed">
                  Anyone with this link can view a copy of your design. They will be able to make edits and save it to their own dashboard.
                </p>
                
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="flex-1 bg-transparent px-2.5 text-[11px] text-stone-650 focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-155 shrink-0 ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-55 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
