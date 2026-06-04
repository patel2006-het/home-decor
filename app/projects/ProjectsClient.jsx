"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { projectService } from "@/lib/projectService";
import { useAuth } from "@/context/AuthContext";
import { roomSelectionData } from "@/lib/data";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "My Projects" },
];

export default function ProjectsClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated"); // "updated", "created", "alphabetical"
  const [invitations, setInvitations] = useState([]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // null, "rename", "delete", "share"
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectNameInput, setProjectNameInput] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects(user?.id);
      setProjects(data);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (e) {
      console.error("Failed to fetch invitations:", e);
    }
  };

  const handleResponseInvite = async (inviteId, status) => {
    try {
      const res = await fetch(`/api/invitations/${inviteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchInvitations();
        fetchProjects();
      }
    } catch (e) {
      console.error("Failed to respond to invitation:", e);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProjects();
      fetchInvitations();
    }
  }, [user?.id, authLoading]);

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
      await fetchProjects();
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to rename project:", err);
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
      await fetchProjects();
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
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
      await fetchProjects();
    } catch (err) {
      console.error("Failed to duplicate project:", err);
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
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper stats for rendering project cards
  const getProjectStats = (project) => {
    const data = project.designData;
    if (!data) return { roomsCount: 0, roomNamesList: "", primaryRoomType: "living-room" };
    const rooms = data.roomsList || [];
    
    if (rooms.length > 0) {
      return {
        roomsCount: rooms.length,
        roomNamesList: rooms.map((r) => r.name).join(", "),
        primaryRoomType: rooms[0].type,
      };
    }
    
    // Legacy single-room projects
    const legacyRoom = data.selectedRoom?.slug || "living-room";
    const legacyName = data.selectedRoom?.name || "Living Room";
    return {
      roomsCount: 1,
      roomNamesList: legacyName,
      primaryRoomType: legacyRoom,
    };
  };

  const getRoomIcon = (type) => {
    const icons = {
      "bedroom": "🛏️",
      "living-room": "🛋️",
      "kitchen": "🍳",
      "bathroom": "🛁",
      "dining-room": "🪵",
      "office": "🖥️",
      "balcony": "🌴",
    };
    return icons[type] || "🏠";
  };

  const getRoomImage = (type) => {
    const matched = roomSelectionData.find((r) => r.slug === type);
    return matched?.image || "/images/living-room.jpg";
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "updated") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortBy === "created") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "alphabetical") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-8 shadow-xl mb-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(139,115,85,0.2),transparent)]" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              My Design Projects
            </h1>
            <p className="mt-2 text-sm text-stone-400 max-w-md">
              Create, duplicate, rename, or share your interior spaces. All your house layouts are saved locally.
            </p>
          </div>
          <Link
            href="/select-room"
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 active:scale-98 transition-all shrink-0"
          >
            + Start New Design
          </Link>
        </div>
      </div>

      {/* Incoming Invitations Banner */}
      {invitations.length > 0 && (
        <div className="rounded-3xl border border-brand-200 bg-brand-50/50 p-6 mb-8 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-700 mb-4 flex items-center gap-2">
            <span>👥 Incoming Project Invitations</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-black text-white">
              {invitations.length}
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="rounded-2xl border border-stone-200 bg-white p-4.5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-stone-900 truncate">
                    {invite.projectName}
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-1 leading-normal">
                    Invited by: <strong className="font-semibold text-stone-700">{invite.inviterName}</strong> ({invite.inviterEmail})
                  </p>
                  <p className="text-[9px] text-stone-405 mt-0.5 font-medium">
                    Role: <span className="uppercase font-bold text-brand-650">{invite.role || "editor"}</span>
                  </p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleResponseInvite(invite.id, "accepted")}
                    className="flex-1 rounded-xl bg-brand-700 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-850 active:scale-98 transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponseInvite(invite.id, "rejected")}
                    className="flex-1 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-6 mb-8">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-450 pointer-events-none">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-stone-200 bg-white pl-9 pr-4 py-2.5 text-sm text-stone-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 focus:border-brand-500 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Date Created</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading || authLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-brand-700" />
          <p className="text-xs text-stone-500">Loading your projects...</p>
        </div>
      ) : sortedProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => {
            const stats = getProjectStats(project);
            return (
              <Link
                key={project.id}
                href={`/designer?project=${project.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:border-brand-300 hover:shadow-md transition-all duration-300"
              >
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={getRoomImage(stats.primaryRoomType)}
                    alt={project.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 shadow-sm backdrop-blur-sm">
                    <span className="text-lg" role="img" aria-label={stats.primaryRoomType}>
                      {getRoomIcon(stats.primaryRoomType)}
                    </span>
                  </div>
                  
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
                  
                  <p className="mt-1.5 text-xs text-stone-555 line-clamp-1">
                    <span className="font-medium text-stone-500">Rooms:</span> {stats.roomNamesList}
                  </p>
                  
                  <div className="mt-auto border-t border-stone-100 pt-4 flex flex-col gap-1 text-[10px] text-stone-400">
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-semibold text-stone-555">{formatDate(project.updatedAt)}</span>
                    </div>
                  </div>
                  
                  {/* Actions overlay */}
                  <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-stone-50 pt-3.5">
                    <button
                      onClick={(e) => handleOpenRename(project, e)}
                      className="rounded-lg p-1.5 text-stone-450 hover:bg-stone-50 hover:text-stone-700 transition-colors"
                      title="Rename Design"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => handleDuplicate(project.id, e)}
                      className="rounded-lg p-1.5 text-stone-450 hover:bg-stone-50 hover:text-stone-700 transition-colors"
                      title="Duplicate Design"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => handleOpenShare(project, e)}
                      className="rounded-lg p-1.5 text-stone-450 hover:bg-stone-50 hover:text-stone-700 transition-colors"
                      title="Share Design Link"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318M8.684 13.258l4.636 2.318m6-4.161a3 3 0 11-6 0 3 3 0 016 0zm-6-5a3 3 0 11-6 0 3 3 0 016 0zm6 10a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>

                    <span className="h-4 w-px bg-stone-100 mx-1" />

                    <button
                      onClick={(e) => handleOpenDelete(project, e)}
                      className="rounded-lg p-1.5 text-stone-450 hover:bg-red-50 hover:text-red-555 transition-colors ml-auto"
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
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 text-3xl shadow-inner mb-5">
            📂
          </div>
          <h3 className="font-display text-lg font-semibold text-stone-900">
            No projects found
          </h3>
          <p className="mt-2 text-sm text-stone-500 max-w-sm">
            {searchQuery ? "No projects match your search criteria. Try a different query." : "You haven't saved any designs yet. Bring your interior design ideas to life!"}
          </p>
          {!searchQuery && (
            <Link
              href="/select-room"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-800 transition-colors"
            >
              Design Your First Space
            </Link>
          )}
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
                    className="rounded-full px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
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
                <p className="text-xs text-stone-500 leading-relaxed">
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
                    className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
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
