"use client";

import { useState, useCallback } from "react";
import { wallColors, floorTypes } from "@/lib/data";
import DesignerSidebar from "@/components/designer/DesignerSidebar";
import DesignerPreview from "@/components/designer/DesignerPreview";
import { useDesign } from "@/context/DesignContext";

/**
 * DesignerClient — The single "use client" boundary for the /designer page.
 *
 * Owns all interactive state:
 *  - selectedColor    (wall color)
 *  - selectedFloor    (floor type)
 *  - furnitureItems   (placed furniture instances — Step 5)
 *  - sidebarOpen      (mobile sidebar toggle)
 *
 * Furniture state shape:
 *  { instanceId: string, id: string, name, icon, color, width, height }
 *  instanceId is unique per placement (same item can be added multiple times in Step 6).
 *
 * @param {{ slug, name, image, description }} room
 * @param {{ slug, name, image, description }} style
 */
export default function DesignerClient({ room: initialRoom, style: initialStyle }) {
  const {
    selectedRoom,
    selectedStyle,
    furnitureItems,
    addFurnitureItem,
    removeFurnitureItemById,
    removeFurnitureItemByInstance,
  } = useDesign();

  const room = selectedRoom || initialRoom;
  const style = selectedStyle || initialStyle;

  const [selectedColor, setSelectedColor]   = useState(wallColors[0]);
  const [selectedFloor, setSelectedFloor]   = useState(floorTypes[0]);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

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
          selectedColor={selectedColor}
          selectedFloor={selectedFloor}
          onColorChange={setSelectedColor}
          onFloorChange={setSelectedFloor}
          placedFurniture={furnitureItems}
          onFurnitureAdd={addFurnitureItem}
          onFurnitureRemove={removeFurnitureItemById}
        />
      </div>

      {/* ── Preview canvas ── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <DesignerPreview
          wallColor={selectedColor.hex}
          floorPattern={selectedFloor.pattern}
          roomName={room.name}
          styleName={style.name}
          furnitureItems={furnitureItems}
          onFurnitureRemove={removeFurnitureItemByInstance}
        />
      </main>
    </div>
  );
}
