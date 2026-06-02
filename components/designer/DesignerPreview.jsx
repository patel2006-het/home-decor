"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import RoomCanvas3D with SSR disabled to prevent hydration mismatches
// because WebGL and Three.js rely on browser-only window/WebGLContext APIs.
const RoomCanvas3D = dynamic(
  () => import("@/components/designer/RoomCanvas3D"),
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

        {/* Save button */}
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-400"
          title="Save design (coming soon)"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Save Design
        </button>
      </div>

      {/* ── WebGL 3D Canvas Area ── */}
      <div className="relative flex-1 overflow-hidden">
        <RoomCanvas3D
          wallColor={wallColor}
          selectedFloor={selectedFloor}
          furnitureItems={furnitureItems}
        />

        {/* ── Info badges overlay ── */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span
              className="h-3 w-3 rounded-full border border-stone-200 shadow-sm"
              style={{ backgroundColor: wallColor }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-stone-700">Wall</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-medium text-stone-700">Floor</span>
            <span
              className="h-3 w-10 rounded-sm border border-stone-200"
              style={{ backgroundImage: selectedFloor?.pattern, backgroundSize: "62px 100%" }}
              aria-hidden="true"
            />
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
