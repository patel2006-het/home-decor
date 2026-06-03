"use client";

import React, { useState, useMemo } from "react";
import { useDesign } from "@/context/DesignContext";
import { furnitureCatalog } from "@/lib/data";

/**
 * FurnitureLibrary — Premium UI sidebar panel.
 * 
 * Combines:
 * - A tabbed & searchable furniture catalog for placing items.
 * - An Inspector panel for rotating, scaling, switching transform modes, or removing the selected item.
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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Get catalog items for current room
  const catalogItems = useMemo(() => {
    return furnitureCatalog[roomSlug] ?? [];
  }, [roomSlug]);

  // Find the currently selected furniture instance in the room
  const selectedInstance = useMemo(() => {
    if (!selectedInstanceId) return null;
    return furnitureItems.find((item) => item.instanceId === selectedInstanceId) || null;
  }, [selectedInstanceId, furnitureItems]);

  // Unique categories in catalog
  const categories = useMemo(() => {
    const cats = new Set(catalogItems.map((item) => item.category));
    return ["All", ...Array.from(cats)];
  }, [catalogItems]);

  // Filtered catalog items based on tab & search query
  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesTab = activeTab === "All" || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [catalogItems, activeTab, searchQuery]);

  // Set of placed item IDs (for UI added status)
  const placedIds = useMemo(() => {
    return new Set(furnitureItems.map((p) => p.id));
  }, [furnitureItems]);

  // Handle manual Y-rotation slider changes (0 to 360 degrees)
  const handleRotationChange = (e) => {
    if (!selectedInstance) return;
    const deg = parseFloat(e.target.value);
    const rad = (deg * Math.PI) / 180;
    updateFurnitureTransform(selectedInstance.instanceId, {
      rotation: { x: 0, y: rad, z: 0 },
    });
  };

  // Handle manual uniform scale slider changes (0.5 to 1.5)
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
    // Normalize to 0 to 2*PI
    rad = rad % (2 * Math.PI);
    if (rad < 0) rad += 2 * Math.PI;
    const deg = Math.round((rad * 180) / Math.PI);
    return deg;
  }, [selectedInstance]);

  // Current uniform scale value (assuming uniform X/Y/Z)
  const currentScale = useMemo(() => {
    if (!selectedInstance?.scale) return 1.0;
    return selectedInstance.scale.x || 1.0;
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
                Selected Furniture
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
                {selectedInstance.category}
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
            <div className="flex justify-between mt-1 text-[10px] text-stone-400">
              <span>0°</span>
              <span>180°</span>
              <span>360°</span>
            </div>
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
            <div className="flex justify-between mt-1 text-[10px] text-stone-400">
              <span>50%</span>
              <span>100%</span>
              <span>150%</span>
            </div>
          </div>

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

      {/* ── 2. CATALOG SECTION ── */}
      <div className="flex flex-col gap-3">
        {/* Title / Description */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
            Furniture Catalog
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Select items to place in your 3D canvas
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search furniture..."
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

        {/* Category Tabs (Scrollable horizontally if needed) */}
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

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center">
            <p className="text-xs text-stone-400">
              No matching furniture found.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isAdded = placedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    // Prevent adding multiple instances of the same item if already added
                    if (!isAdded) {
                      addFurnitureItem(item);
                    } else {
                      // If already added, select its instance in the room
                      const inst = furnitureItems.find((p) => p.id === item.id);
                      if (inst) setSelectedInstanceId(inst.instanceId);
                    }
                  }}
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-all duration-200 ${
                    isAdded
                      ? "border-brand-300 bg-brand-50/50 hover:bg-brand-50"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                  }`}
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
                    <p className={`truncate text-xs font-semibold leading-tight ${isAdded ? "text-brand-800" : "text-stone-800"}`}>
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-stone-400">{item.category}</p>
                  </div>

                  {/* Add status indicator */}
                  <div className="shrink-0 pl-1">
                    {isAdded ? (
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
