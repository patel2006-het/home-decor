"use client";

import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDesign } from "@/context/DesignContext";
import { projectService } from "@/lib/projectService";
import { useAuth } from "@/context/AuthContext";
import BudgetEstimatorModal from "@/components/designer/BudgetEstimatorModal";

// Dynamically import RoomScene with SSR disabled to prevent hydration mismatches
// because WebGL and Three.js rely on browser-only window/WebGLContext APIs.
const RoomScene = dynamic(
  () => import("@/components/3d/RoomScene"),
  { ssr: false }
);

/**
 * DesignerPreview — The main 3D room canvas area.
 *
 * Renders the dynamically loaded 3D Room Engine.
 */
export default function DesignerPreview({
  wallColor,
  selectedFloor,
  roomName,
  styleName,
  furnitureItems = [],
  onFurnitureRemove,
  isSharedView = false,
  onSaveShared,
}) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    selectedInstanceId,
    transformMode,
    setTransformMode,
    removeFurnitureItemByInstance,
    roomMaterials,
    saveDesign,
    loadDesign,
    // Project context values
    activeProjectId,
    activeProjectName,
    saveCurrentProject,
    resetProjectState,
    setActiveProjectName,
  } = useDesign();

  const [activeModal, setActiveModal] = React.useState(null); // null, "save", "rename", "share"
  const [projectNameInput, setProjectNameInput] = React.useState("");
  const [shareLink, setShareLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState("idle"); // "idle", "saving", "saved"

  const handleSaveClick = async () => {
    if (isSharedView) {
      setProjectNameInput("My Shared Design");
      setActiveModal("save");
      return;
    }
    
    if (activeProjectId) {
      setSaveStatus("saving");
      try {
        await saveCurrentProject(activeProjectName);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      } catch (err) {
        console.error("Failed to save project:", err);
        setSaveStatus("idle");
      }
    } else {
      setProjectNameInput(`${roomName} Design`);
      setActiveModal("save");
    }
  };

  const handleSaveModalSubmit = async (e) => {
    e.preventDefault();
    if (!projectNameInput.trim()) return;
    
    setSaveStatus("saving");
    setActiveModal(null);
    try {
      if (isSharedView) {
        const newId = await onSaveShared(projectNameInput);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      } else {
        const newId = await saveCurrentProject(projectNameInput);
        setSaveStatus("saved");
        router.replace(`/designer?project=${newId}`);
        setTimeout(() => setSaveStatus("idle"), 1500);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("idle");
    }
  };

  const handleRenameClick = () => {
    setProjectNameInput(activeProjectName || "");
    setActiveModal("rename");
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!projectNameInput.trim()) return;
    
    try {
      await projectService.renameProject(activeProjectId, projectNameInput);
      setActiveProjectName(projectNameInput.trim());
      setActiveModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareClick = () => {
    const designData = saveDesign();
    const encoded = projectService.encodeShareLink(designData);
    if (encoded) {
      const shareUrl = `${window.location.origin}/designer?share=${encoded}`;
      setShareLink(shareUrl);
      setActiveModal("share");
      setCopied(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDuplicateClick = async () => {
    if (!activeProjectId) return;
    setSaveStatus("saving");
    try {
      const dup = await projectService.duplicateProject(activeProjectId, user?.id);
      setSaveStatus("saved");
      router.push(`/designer?project=${dup.id}`);
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch (err) {
      console.error(err);
      setSaveStatus("idle");
    }
  };

  const handleNewProjectClick = () => {
    resetProjectState();
    router.push("/select-room");
  };

  // Find the selected furniture instance
  const selectedInstance = React.useMemo(() => {
    if (!selectedInstanceId) return null;
    return furnitureItems.find((item) => item.instanceId === selectedInstanceId) || null;
  }, [selectedInstanceId, furnitureItems]);

  return (
    <div className="flex h-full flex-col">
      {/* ── Top bar ── */}
      <div className="flex shrink-0 flex-col border-b border-stone-200 bg-white px-6 py-3 sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <Link
            href="/projects"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-colors"
            title="Go to Projects Dashboard"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {isSharedView ? (
                <>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                    Shared View
                  </span>
                  <h1 className="font-display text-sm font-semibold text-stone-900">
                    Shared Interior Design
                  </h1>
                </>
              ) : activeProjectId ? (
                <>
                  <h1 className="font-display text-sm font-semibold text-stone-900 max-w-[180px] sm:max-w-[240px] truncate">
                    {activeProjectName}
                  </h1>
                  <button
                    onClick={handleRenameClick}
                    className="rounded p-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
                    title="Rename Project"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Saved
                  </span>
                </>
              ) : (
                <>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 border border-stone-200">
                    Unsaved Draft
                  </span>
                  <h1 className="font-display text-sm font-semibold text-stone-900">
                    New House Design
                  </h1>
                </>
              )}
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              {roomName} · {styleName}
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {isSharedView ? (
            <button
              type="button"
              onClick={handleSaveClick}
              className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save to My Projects
            </button>
          ) : (
            <>
              {/* New design */}
              <button
                type="button"
                onClick={handleNewProjectClick}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                title="Start a new design from scratch"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>

              {/* Duplicate */}
              {activeProjectId && (
                <button
                  type="button"
                  onClick={handleDuplicateClick}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  title="Duplicate this project"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Duplicate
                </button>
              )}

              {/* Share */}
              <button
                type="button"
                onClick={handleShareClick}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                title="Generate a sharing URL"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318M8.684 13.258l4.636 2.318m6-4.161a3 3 0 11-6 0 3 3 0 016 0zm-6-5a3 3 0 11-6 0 3 3 0 016 0zm6 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Share
              </button>

              {/* Budget */}
              <button
                type="button"
                onClick={() => setActiveModal("budget")}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-650 hover:bg-stone-50 hover:text-stone-850 transition-colors"
                title="View budget estimation and project cost breakdown"
              >
                <svg className="h-3.5 w-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Budget
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={handleSaveClick}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 ${
                  saveStatus === "saved"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : saveStatus === "saving"
                    ? "bg-stone-400 text-white cursor-not-allowed"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saved" ? (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : saveStatus === "saving" ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Design
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── WebGL 3D Canvas Area ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Shared view banner overlay */}
        {isSharedView && (
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/95 px-4 py-3 shadow-md backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-850">
                💡
              </span>
              <p className="text-xs font-medium text-amber-900">
                You are viewing a shared design. Save it to your projects to start customizing!
              </p>
            </div>
            <button
              onClick={handleSaveClick}
              className="shrink-0 rounded-full bg-amber-600 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-amber-700 transition-colors shadow-sm"
            >
              Save to Projects
            </button>
          </div>
        )}

        <RoomScene
          furnitureItems={furnitureItems}
        />

        {/* ── Floating Canvas Toolbar (Visible when item is selected) ── */}
        {selectedInstance && (
          <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 border-r border-stone-100 pr-2 mr-1">
              Tools
            </span>
            {[
              {
                mode: "translate",
                label: "Move",
                icon: (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5L21 9.5M21 9.5L19 11.5M21 9.5H3M5 16.5L3 14.5M3 14.5L5 12.5M3 14.5H21" />
                  </svg>
                ),
              },
              {
                mode: "rotate",
                label: "Rotate",
                icon: (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                  </svg>
                ),
              },
              {
                mode: "scale",
                label: "Scale",
                icon: (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                ),
              },
            ].map((btn) => (
              <button
                key={btn.mode}
                onClick={() => setTransformMode(btn.mode)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                  transformMode === btn.mode
                    ? "bg-brand-700 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                }`}
                title={`${btn.label} item`}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
            <span className="h-4 w-px bg-stone-200 mx-1" />
            <button
              onClick={() => removeFurnitureItemByInstance(selectedInstance.instanceId)}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150"
              title="Delete item"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}

        {/* ── Info badges overlay ── */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm animate-in fade-in duration-300">
            <span
              className="h-3 w-3 rounded-full border border-stone-200 shadow-sm"
              style={{ backgroundColor: roomMaterials.walls.color }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-stone-700">
              Walls: <span className="capitalize text-brand-600 font-bold">{roomMaterials.walls.type}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm animate-in fade-in duration-300">
            <span
              className="h-3 w-3 rounded-full border border-stone-200 shadow-sm"
              style={{ backgroundColor: roomMaterials.flooring.color }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-stone-700">
              Floor: <span className="capitalize text-brand-600 font-bold">{roomMaterials.flooring.type}</span>
            </span>
          </div>
          {furnitureItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-xs font-medium text-brand-700">
                {furnitureItems.length} item{furnitureItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals Overlay ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-display text-base font-semibold text-stone-900">
                {activeModal === "save" && (isSharedView ? "Save Copy to Dashboard" : "Save Your Design")}
                {activeModal === "rename" && "Rename Project"}
                {activeModal === "share" && "Share Your Design"}
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

            {/* Modal Body: Save / Rename Form */}
            {(activeModal === "save" || activeModal === "rename") && (
              <form onSubmit={activeModal === "save" ? handleSaveModalSubmit : handleRenameSubmit} className="mt-4 flex flex-col gap-4">
                <div>
                  <label htmlFor="project-name" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Project Name
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    required
                    maxLength={30}
                    placeholder="e.g. Modern Suite, Cozy Lounge"
                    value={projectNameInput}
                    onChange={(e) => setProjectNameInput(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                    autoFocus
                  />
                </div>
                
                <div className="flex items-center justify-end gap-2 border-t border-stone-50 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all active:scale-95"
                  >
                    Confirm
                  </button>
                </div>
              </form>
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
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150 shrink-0 ${
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

      {/* ── Budget Modal Overlay ── */}
      {activeModal === "budget" && (
        <BudgetEstimatorModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
