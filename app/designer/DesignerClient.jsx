"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DesignerSidebar from "@/components/designer/DesignerSidebar";
import DesignerPreview from "@/components/designer/DesignerPreview";
import { useDesign } from "@/context/DesignContext";
import { roomSelectionData } from "@/lib/data";
import { projectService } from "@/lib/projectService";

/**
 * DesignerClient — The single "use client" boundary for the /designer page.
 *
 * Owns all interactive state:
 *  - furnitureItems   (placed furniture instances)
 *  - sidebarOpen      (mobile sidebar toggle)
 *
 * @param {{ slug, name, image, description }} room
 * @param {{ slug, name, image, description }} style
 */
export default function DesignerClient({ 
  room: initialRoom, 
  style: initialStyle,
  projectId = null,
  shareData = null
}) {
  const router = useRouter();
  const {
    selectedRoom,
    selectedStyle,
    furnitureItems,
    roomsList,
    activeRoomId,
    initializeHouse,
    loadDesign,
    loadProject,
    activeProjectId,
    setActiveProjectId,
    setActiveProjectName,
    saveDesign,
  } = useDesign();

  const [loading, setLoading] = useState(true);
  const [isSharedView, setIsSharedView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const initWorkspace = async () => {
      setLoading(true);
      try {
        if (shareData) {
          const decoded = projectService.decodeShareLink(shareData);
          if (decoded && active) {
            loadDesign(decoded);
            setIsSharedView(true);
            setActiveProjectId(null);
            setActiveProjectName(null);
          } else if (active) {
            initializeHouse(initialRoom);
          }
        } else if (projectId) {
          const project = await projectService.getProjectById(projectId);
          if (project && active) {
            loadProject(project);
            setIsSharedView(false);
          } else if (active) {
            // Project not found, fall back to default
            console.warn(`Project ${projectId} not found, redirecting...`);
            initializeHouse(initialRoom);
            router.replace("/designer");
          }
        } else if (active) {
          if (roomsList.length === 0) {
            initializeHouse(initialRoom);
          }
          setIsSharedView(false);
        }
      } catch (err) {
        console.error("Error loading workspace:", err);
        if (active) initializeHouse(initialRoom);
      } finally {
        if (active) setLoading(false);
      }
    };

    initWorkspace();

    return () => {
      active = false;
    };
  }, [projectId, shareData, initialRoom, initializeHouse, loadDesign, loadProject, router]);

  const handleSaveShared = async (name) => {
    const designData = saveDesign();
    const created = await projectService.createProject(name, designData);
    setActiveProjectId(created.id);
    setActiveProjectName(created.name);
    setIsSharedView(false);
    router.replace(`/designer?project=${created.id}`);
    return created.id;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-65px)] w-full flex-col items-center justify-center bg-cream gap-4">
        {/* Premium Spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-stone-200 border-t-brand-700" />
          <span className="text-xl font-display font-semibold text-brand-700">H</span>
        </div>
        <div className="text-center">
          <h2 className="font-display text-lg font-medium text-stone-900 animate-pulse">Loading Design Studio</h2>
          <p className="text-xs text-stone-500 mt-1">Assembling 3D interior design workspace...</p>
        </div>
      </div>
    );
  }

  const activeRoomObj = roomsList.find((r) => r.id === activeRoomId) || roomsList[0];
  const baseRoom = selectedRoom || initialRoom;
  const roomMeta = roomSelectionData.find((r) => r.slug === (activeRoomObj?.type || baseRoom.slug)) || baseRoom;

  const room = {
    ...roomMeta,
    slug: activeRoomObj?.type || baseRoom.slug,
    name: activeRoomObj?.name || baseRoom.name,
  };
  const style = selectedStyle || initialStyle;

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden lg:flex-row">

      {/* ── Mobile sidebar toggle bar ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
        <p className="font-display text-base font-medium text-stone-900">
          {room.name} · {style.name}
        </p>
        <button
          type="button"
          aria-expanded={sidebarOpen}
          aria-controls="designer-sidebar"
          aria-label={sidebarOpen ? "Close design controls" : "Open design controls"}
          onClick={() => setSidebarOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Customize
        </button>
      </div>

      {/* ── Sidebar ── */}
      <div
        id="designer-sidebar"
        className={`shrink-0 overflow-y-auto border-b border-stone-200 lg:w-72 lg:border-b-0 xl:w-80 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
        style={{ maxHeight: sidebarOpen ? "60vh" : undefined }}
      >
        <DesignerSidebar
          room={room}
          style={style}
        />
      </div>

      {/* ── Preview canvas ── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <DesignerPreview
          roomName={room.name}
          styleName={style.name}
          furnitureItems={furnitureItems}
          isSharedView={isSharedView}
          onSaveShared={handleSaveShared}
        />
      </main>
    </div>
  );
}
