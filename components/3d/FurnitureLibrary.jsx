"use client";

import React, { useState, useMemo } from "react";
import { useDesign } from "@/context/DesignContext";
import { furnitureCatalog, roomElementsCatalog } from "@/lib/data";

/**
 * FurnitureLibrary — Premium UI sidebar panel.
 * 
 * Combines:
 * - A tabbed & searchable catalog for placing furniture and architectural elements (Doors, Windows, Curtains).
 * - A detailed Inspector panel for adjusting position, rotation, height, and scale dimensions.
 */
export default function FurnitureLibrary({ roomSlug }) {
  const {
    furnitureItems,
    addFurnitureItem,
    removeFurnitureItemByInstance,
    updateFurnitureTransform,
    selectedInstanceId,
    setSelectedInstanceId,
    transformMode,
    setTransformMode,
  } = useDesign();

  const [activeSection, setActiveSection] = useState("furniture"); // "furniture" | "elements"
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Get furniture items for current room
  const catalogItems = useMemo(() => {
    return furnitureCatalog[roomSlug] ?? [];
  }, [roomSlug]);

  // Find the currently selected item instance in the room
  const selectedInstance = useMemo(() => {
    if (!selectedInstanceId) return null;
    return furnitureItems.find((item) => item.instanceId === selectedInstanceId) || null;
  }, [selectedInstanceId, furnitureItems]);

  // Unique categories in furniture catalog
  const categories = useMemo(() => {
    const cats = new Set(catalogItems.map((item) => item.category));
    return ["All", ...Array.from(cats)];
  }, [catalogItems]);

  // Filtered list of items based on active section, tab & search query
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (activeSection === "furniture") {
      return catalogItems.filter((item) => {
        const matchesTab = activeTab === "All" || item.category === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(query) ||
                              item.category.toLowerCase().includes(query);
        return matchesTab && matchesSearch;
      });
    } else {
      // Room Elements catalog
      return roomElementsCatalog.filter((item) => {
        return item.name.toLowerCase().includes(query) ||
               item.category.toLowerCase().includes(query);
      });
    }
  }, [catalogItems, activeSection, activeTab, searchQuery]);

  // Set of placed item IDs (for UI added status)
  const placedIds = useMemo(() => {
    return new Set(furnitureItems.map((p) => p.id));
  }, [furnitureItems]);

  // ──── FURNITURE INSPECTOR HANDLERS ────
  const handleRotationChange = (e) => {
    if (!selectedInstance) return;
    const deg = parseFloat(e.target.value);
    const rad = (deg * Math.PI) / 180;
    updateFurnitureTransform(selectedInstance.instanceId, {
      rotation: { x: 0, y: rad, z: 0 },
    });
  };

  const handleScaleChange = (e) => {
    if (!selectedInstance) return;
    const s = parseFloat(e.target.value);
    updateFurnitureTransform(selectedInstance.instanceId, {
      scale: { x: s, y: s, z: s },
    });
  };

  // Convert current Y rotation in radians back to degrees (0 to 360)
  const currentRotationDeg = useMemo(() => {
    if (!selectedInstance?.rotation) return 0;
    let rad = selectedInstance.rotation.y || 0;
    rad = rad % (2 * Math.PI);
    if (rad < 0) rad += 2 * Math.PI;
    return Math.round((rad * 180) / Math.PI);
  }, [selectedInstance]);

  // Current uniform scale value
  const currentScale = useMemo(() => {
    if (!selectedInstance?.scale) return 1.0;
    return selectedInstance.scale.x || 1.0;
  }, [selectedInstance]);


  // ──── ARCHITECTURAL ELEMENTS INSPECTOR HANDLERS ────

  // Moves the door/window/curtain horizontally along its snapped wall
  const handleSlideChange = (e) => {
    if (!selectedInstance) return;
    const s = parseFloat(e.target.value);

    // Detect which wall the element is closest to
    const pctX = selectedInstance.position?.x ?? 50;
    const pctY = selectedInstance.position?.y ?? 50;
    const x3D = (pctX / 100) * 5.4 - 2.7;
    const z3D = (pctY / 100) * 4.4 - 2.2;

    const distBack = Math.abs(z3D - (-2.5));
    const distFront = Math.abs(z3D - 2.5);
    const distLeft = Math.abs(x3D - (-3));
    const distRight = Math.abs(x3D - 3);

    const minDist = Math.min(distBack, distFront, distLeft, distRight);

    if (minDist === distBack || minDist === distFront) {
      // Slides horizontally along the X-axis
      updateFurnitureTransform(selectedInstance.instanceId, {
        position: { x: s, y: pctY },
      });
    } else {
      // Slides horizontally along the Z-axis (which maps to pctY)
      updateFurnitureTransform(selectedInstance.instanceId, {
        position: { x: pctX, y: s },
      });
    }
  };

  // Determines slider position based on which wall the item is currently snapped to
  const currentSlideValue = useMemo(() => {
    if (!selectedInstance) return 50;
    const pctX = selectedInstance.position?.x ?? 50;
    const pctY = selectedInstance.position?.y ?? 50;
    const x3D = (pctX / 100) * 5.4 - 2.7;
    const z3D = (pctY / 100) * 4.4 - 2.2;

    const distBack = Math.abs(z3D - (-2.5));
    const distFront = Math.abs(z3D - 2.5);
    const distLeft = Math.abs(x3D - (-3));
    const distRight = Math.abs(x3D - 3);

    const minDist = Math.min(distBack, distFront, distLeft, distRight);

    if (minDist === distBack || minDist === distFront) {
      return Math.round(pctX);
    } else {
      return Math.round(pctY);
    }
  }, [selectedInstance]);

  // Adjusts the height from floor (vertical Y position)
  const handleHeightOffsetChange = (e) => {
    if (!selectedInstance) return;
    const h = parseFloat(e.target.value);
    updateFurnitureTransform(selectedInstance.instanceId, {
      heightOffset: h,
    });
  };

  const currentHeightOffset = useMemo(() => {
    if (!selectedInstance) return 0;
    const category = selectedInstance.category;
    const fallback = category === "Door" ? 0 : category === "Window" ? 1.0 : 1.2;
    return selectedInstance.heightOffset ?? fallback;
  }, [selectedInstance]);

  // Width Resizing (maps to scale.x)
  const handleWidthScaleChange = (e) => {
    if (!selectedInstance) return;
    const sw = parseFloat(e.target.value);
    const currentMeshScale = selectedInstance.scale || { x: 1, y: 1, z: 1 };
    updateFurnitureTransform(selectedInstance.instanceId, {
      scale: { ...currentMeshScale, x: sw },
    });
  };

  const currentWidthScale = useMemo(() => {
    if (!selectedInstance?.scale) return 1.0;
    return selectedInstance.scale.x;
  }, [selectedInstance]);

  // Height Resizing (maps to scale.y)
  const handleHeightScaleChange = (e) => {
    if (!selectedInstance) return;
    const sh = parseFloat(e.target.value);
    const currentMeshScale = selectedInstance.scale || { x: 1, y: 1, z: 1 };
    updateFurnitureTransform(selectedInstance.instanceId, {
      scale: { ...currentMeshScale, y: sh },
    });
  };

  const currentHeightScale = useMemo(() => {
    if (!selectedInstance?.scale) return 1.0;
    return selectedInstance.scale.y;
  }, [selectedInstance]);

  // Resolve Wall Name Label
  const snappedWallLabel = useMemo(() => {
    if (!selectedInstance) return "";
    const pctX = selectedInstance.position?.x ?? 50;
    const pctY = selectedInstance.position?.y ?? 50;
    const x3D = (pctX / 100) * 5.4 - 2.7;
    const z3D = (pctY / 100) * 4.4 - 2.2;

    const distBack = Math.abs(z3D - (-2.5));
    const distFront = Math.abs(z3D - 2.5);
    const distLeft = Math.abs(x3D - (-3));
    const distRight = Math.abs(x3D - 3);

    const minDist = Math.min(distBack, distFront, distLeft, distRight);

    if (minDist === distBack) return "Back Wall";
    if (minDist === distFront) return "Front Wall";
    if (minDist === distLeft) return "Left Wall";
    return "Right Wall";
  }, [selectedInstance]);

  return (
    <div className="flex flex-col gap-5 px-5 py-4">
      
      {/* ── 1. SELECTED ITEM INSPECTOR PANEL ── */}
      {selectedInstance && (
        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between border-b border-brand-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                {selectedInstance.isArchitectural ? "Selected Element" : "Selected Furniture"}
              </p>
            </div>
            <button
              onClick={() => setSelectedInstanceId(null)}
              className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
              title="Deselect item"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm border border-white/80"
              style={{ backgroundColor: selectedInstance.color }}
            >
              {selectedInstance.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-stone-900">
                {selectedInstance.name}
              </h4>
              <p className="truncate text-xs text-stone-500">
                {selectedInstance.category} {selectedInstance.isArchitectural && snappedWallLabel && `· ${snappedWallLabel}`}
              </p>
            </div>
          </div>

          {/* Transform Mode buttons */}
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              3D Edit Mode
            </p>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-stone-100 p-0.5">
              {[
                { mode: "translate", label: "Move" },
                { mode: "rotate", label: "Rotate" },
                { mode: "scale", label: "Scale" },
              ].map((btn) => (
                <button
                  key={btn.mode}
                  type="button"
                  onClick={() => setTransformMode(btn.mode)}
                  className={`rounded-md py-1 text-xs font-medium transition-all duration-150 ${
                    transformMode === btn.mode
                      ? "bg-white text-brand-700 shadow-sm font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CONDITIONAL SLIDERS (Architectural vs Furniture) ── */}
          {selectedInstance.isArchitectural ? (
            <>
              {/* Slide along wall slider */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="slide-slider" className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Slide along Wall
                  </label>
                  <span className="text-xs font-semibold text-stone-700">
                    {currentSlideValue}%
                  </span>
                </div>
                <input
                  id="slide-slider"
                  type="range"
                  min="5"
                  max="95"
                  value={currentSlideValue}
                  onChange={handleSlideChange}
                  className="w-full accent-brand-600"
                />
              </div>

              {/* Height Offset (Vertical Y Position) - Locked for doors */}
              {selectedInstance.category !== "Door" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="height-offset-slider" className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Height from Floor
                    </label>
                    <span className="text-xs font-semibold text-stone-700">
                      {currentHeightOffset.toFixed(1)}m
                    </span>
                  </div>
                  <input
                    id="height-offset-slider"
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.1"
                    value={currentHeightOffset}
                    onChange={handleHeightOffsetChange}
                    className="w-full accent-brand-600"
                  />
                </div>
              )}

              {/* Width Slider (X scale) */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="width-scale-slider" className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Element Width
                  </label>
                  <span className="text-xs font-semibold text-stone-700">
                    {Math.round(currentWidthScale * 100)}%
                  </span>
                </div>
                <input
                  id="width-scale-slider"
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.05"
                  value={currentWidthScale}
                  onChange={handleWidthScaleChange}
                  className="w-full accent-brand-600"
                />
              </div>

              {/* Height Slider (Y scale) */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="height-scale-slider" className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Element Height
                  </label>
                  <span className="text-xs font-semibold text-stone-700">
                    {Math.round(currentHeightScale * 100)}%
                  </span>
                </div>
                <input
                  id="height-scale-slider"
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.05"
                  value={currentHeightScale}
                  onChange={handleHeightScaleChange}
                  className="w-full accent-brand-600"
                />
              </div>
            </>
          ) : (
            <>
              {/* Rotation Slider */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="rotation-slider" className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Rotate (Y-Axis)
                  </label>
                  <span className="text-xs font-semibold text-stone-700">
                    {currentRotationDeg}°
                  </span>
                </div>
                <input
                  id="rotation-slider"
                  type="range"
                  min="0"
                  max="360"
                  value={currentRotationDeg}
                  onChange={handleRotationChange}
                  className="w-full accent-brand-600"
                />
              </div>

              {/* Scale Slider */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="scale-slider" className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Size Scale
                  </label>
                  <span className="text-xs font-semibold text-stone-700">
                    {Math.round(currentScale * 100)}%
                  </span>
                </div>
                <input
                  id="scale-slider"
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={currentScale}
                  onChange={handleScaleChange}
                  className="w-full accent-brand-600"
                />
              </div>
            </>
          )}

          {/* Delete Action Button */}
          <button
            type="button"
            onClick={() => removeFurnitureItemByInstance(selectedInstance.instanceId)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove from Room
          </button>
        </div>
      )}

      {/* ── 2. SECTION SEPARATOR TABS (Furniture vs Elements) ── */}
      <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200/50">
        <button
          type="button"
          onClick={() => {
            setActiveSection("furniture");
            setSearchQuery("");
          }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all duration-150 ${
            activeSection === "furniture"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          🛋️ Furniture
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSection("elements");
            setSearchQuery("");
          }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all duration-150 ${
            activeSection === "elements"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          🚪 Room Elements
        </button>
      </div>

      {/* ── 3. CATALOG SECTION ── */}
      <div className="flex flex-col gap-3">
        {/* Title / Description */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
            {activeSection === "furniture" ? "Furniture Catalog" : "Architectural Elements"}
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {activeSection === "furniture"
              ? "Select items to place in your 3D canvas"
              : "Place Doors, Windows, or Curtains on walls"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={activeSection === "furniture" ? "Search furniture..." : "Search elements..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-1.5 pl-8 pr-3 text-xs font-medium text-stone-700 placeholder-stone-400 outline-none transition-all duration-150 focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Tabs (Only for Furniture Catalog, Room Elements don't need subdivisions) */}
        {activeSection === "furniture" && (
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold transition-all duration-150 ${
                  activeTab === cat
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center">
            <p className="text-xs text-stone-400">
              No matching elements found.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              // Placed status: true if item has been placed (for elements we allow duplicates, so we don't block adding them, but we highlight if at least one instance is placed)
              const isAdded = placedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    // Place the item! Room elements can be placed multiple times
                    addFurnitureItem(item);
                  }}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-200"
                >
                  {/* Color/Icon Swatch */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm border border-stone-100 transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold leading-tight text-stone-800">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-stone-400">{item.category}</p>
                  </div>

                  {/* Place button indicator */}
                  <div className="shrink-0 pl-1">
                    {item.isArchitectural ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 hover:border-brand-400 hover:bg-brand-700 hover:text-white transition-all duration-150">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    ) : isAdded ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 hover:border-brand-400 hover:bg-brand-700 hover:text-white transition-all duration-150">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
