"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useDesign } from "@/context/DesignContext";

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
}) {
  const {
    selectedInstanceId,
    transformMode,
    setTransformMode,
    removeFurnitureItemByInstance,
    roomMaterials,
    saveDesign,
    loadDesign,
  } = useDesign();

  const [saveStatus, setSaveStatus] = React.useState("idle"); // "idle", "saved"
  const [hasSavedDesign, setHasSavedDesign] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setHasSavedDesign(!!window.localStorage.getItem("havendecor_house_design"));
    }
  }, []);

  const handleSave = () => {
    const data = saveDesign();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("havendecor_house_design", JSON.stringify(data));
      setHasSavedDesign(true);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleLoad = () => {
    if (typeof window !== "undefined") {
      const dataStr = window.localStorage.getItem("havendecor_house_design");
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          loadDesign(data);
        } catch (e) {
          console.error("Failed to parse saved design:", e);
        }
      }
    }
  };

  // Find the selected furniture instance
  const selectedInstance = React.useMemo(() => {
    if (!selectedInstanceId) return null;
    return furnitureItems.find((item) => item.instanceId === selectedInstanceId) || null;
  }, [selectedInstanceId, furnitureItems]);

  return (
    <div className="flex h-full flex-col">
      {/* ── Top bar ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
            Live 3D Viewport
          </p>
          <p className="mt-0.5 font-display text-base font-medium text-stone-900">
            {roomName} · {styleName}
          </p>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-2">
          {hasSavedDesign && (
            <button
              type="button"
              onClick={handleLoad}
              className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              title="Load your saved house layout"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Load House
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 ${
              saveStatus === "saved"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
            title="Save your current house layout"
          >
            {saveStatus === "saved" ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save House
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── WebGL 3D Canvas Area ── */}
      <div className="relative flex-1 overflow-hidden">
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
    </div>
  );
}
