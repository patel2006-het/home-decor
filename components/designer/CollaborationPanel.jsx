"use client";

import { useState } from "react";
import { useDesign } from "@/context/DesignContext";
import { useAuth } from "@/context/AuthContext";

export default function CollaborationPanel() {
  const { user } = useAuth();
  const {
    activeProjectId,
    collaborators,
    comments,
    reviewStatus,
    addComment,
    submitReview,
    inviteCollaborator,
    activeRoomId,
    roomsList,
  } = useDesign();

  const [inviteEmail, setInviteEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [filterRoom, setFilterRoom] = useState("all"); // "all" or "current"
  const [inviteStatus, setInviteStatus] = useState({ type: null, message: "" });
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  // Map active room name
  const currentRoomName = roomsList.find((r) => r.id === activeRoomId)?.name || "Current Room";

  // Handle invitation submission
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsSubmittingInvite(true);
    setInviteStatus({ type: null, message: "" });
    try {
      await inviteCollaborator(inviteEmail.trim());
      setInviteStatus({ type: "success", message: `Invitation successfully sent to ${inviteEmail}!` });
      setInviteEmail("");
    } catch (err) {
      setInviteStatus({ type: "error", message: err.message || "Failed to send invitation." });
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const targetRoomId = filterRoom === "current" ? activeRoomId : null;
    addComment(commentText, targetRoomId);
    setCommentText("");
  };

  // Filter comments list
  const filteredComments = comments.filter((c) => {
    if (filterRoom === "current") {
      return c.roomId === activeRoomId;
    }
    return true;
  });

  const getInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Format date helper
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Unsaved/guest check
  if (!activeProjectId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-[300px] border border-dashed border-stone-200 rounded-2xl bg-white/50 m-4">
        <span className="text-3xl mb-3">👥</span>
        <h3 className="text-xs font-bold text-stone-800">Unsaved Project</h3>
        <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
          Please save this project first before inviting collaborators or creating design reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-4 h-full overflow-y-auto">
      
      {/* ── SECTION 1: DESIGN REVIEW STATUS ── */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-700 mb-2">
          Design Review Status
        </h4>
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-semibold text-stone-600">Current Assessment:</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            reviewStatus === "approved"
              ? "bg-emerald-50 border border-emerald-250 text-emerald-700"
              : reviewStatus === "rejected"
              ? "bg-red-50 border border-red-250 text-red-750"
              : "bg-amber-50 border border-amber-250 text-amber-700"
          }`}>
            {reviewStatus || "PENDING"}
          </span>
        </div>

        {/* Action Review Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => submitReview("approved")}
            className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-750 transition-colors"
          >
            ✓ Approve
          </button>
          <button
            type="button"
            onClick={() => submitReview("rejected")}
            className="flex items-center justify-center gap-1 rounded-lg bg-red-650 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-750 transition-colors"
          >
            ✗ Reject
          </button>
        </div>
      </div>

      {/* ── SECTION 2: COLLABORATORS & INVITES ── */}
      <div className="border-b border-stone-100 pb-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">
          Project Participants
        </h4>

        {/* List active collaborators */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[10px] font-black text-white">
              {getInitials(user?.name || "Owner")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-stone-850">
                {user?.name || "Project Owner"} (You)
              </p>
              <p className="text-[9px] text-stone-400">Creator & Administrator</p>
            </div>
          </div>

          {collaborators.map((col, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-[10px] font-black text-white">
                {getInitials(col.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-stone-800">
                  {col.name}
                </p>
                <p className="text-[9px] text-stone-450 uppercase font-semibold">
                  {col.role || "Editor"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInviteSubmit} className="space-y-2">
          <label htmlFor="collab-email" className="text-[10px] font-bold text-stone-450 uppercase tracking-wider block">
            Invite Collaborator
          </label>
          <div className="flex gap-1.5">
            <input
              id="collab-email"
              type="email"
              required
              placeholder="collaborator@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 rounded-lg border border-stone-200 bg-stone-50/50 py-1.5 px-2.5 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-brand-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isSubmittingInvite}
              className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-800 transition-colors shrink-0 disabled:bg-stone-300"
            >
              {isSubmittingInvite ? "Sending..." : "Invite"}
            </button>
          </div>
          {inviteStatus.message && (
            <p className={`text-[10px] font-medium leading-tight ${
              inviteStatus.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}>
              {inviteStatus.message}
            </p>
          )}
        </form>
      </div>

      {/* ── SECTION 3: PROJECT DISCUSSIONS ── */}
      <div className="flex flex-col flex-1 min-h-[220px]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Comments & Reviews
          </h4>
          
          {/* Feed Filter */}
          <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/50">
            <button
              type="button"
              onClick={() => setFilterRoom("all")}
              className={`rounded px-2 py-0.5 text-[9px] font-bold transition-all ${
                filterRoom === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterRoom("current")}
              className={`rounded px-2 py-0.5 text-[9px] font-bold transition-all ${
                filterRoom === "current" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Room Only
            </button>
          </div>
        </div>

        {/* Comment Thread Feed */}
        <div className="flex-1 border border-stone-150 rounded-xl bg-stone-50/50 p-2.5 overflow-y-auto max-h-[200px] mb-3 space-y-2.5">
          {filteredComments.length === 0 ? (
            <p className="text-[11px] text-stone-400 italic text-center py-8">
              No comments posted yet. Start the conversation!
            </p>
          ) : (
            filteredComments.map((comment) => {
              const isSystem = comment.authorName === "System";
              return (
                <div key={comment.id} className="flex gap-2.5 items-start text-xs">
                  {/* Avatar */}
                  <div className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white ${
                    isSystem ? "bg-stone-500" : "bg-brand-500"
                  }`}>
                    {isSystem ? "⚙️" : getInitials(comment.authorName)}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-bold text-stone-850 ${isSystem ? "italic text-stone-500" : ""}`}>
                        {comment.authorName}
                      </span>
                      {comment.roomId && (
                        <span className="rounded bg-brand-50/80 px-1.5 py-0.5 text-[9px] font-bold text-brand-650 uppercase tracking-wide">
                          Room Log
                        </span>
                      )}
                      <span className="text-[9px] text-stone-400 ml-auto shrink-0">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className={`mt-0.5 text-[11px] text-stone-650 leading-relaxed break-words ${
                      isSystem ? "italic text-stone-500 font-medium" : ""
                    }`}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Post Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-1.5">
          <textarea
            required
            rows={2}
            placeholder={
              filterRoom === "current"
                ? `Add a comment specifically for ${currentRoomName}...`
                : "Add a general design comment..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2 px-3 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-brand-500 focus:bg-white resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-brand-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition-colors"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
