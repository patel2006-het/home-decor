"use client";

import React from "react";
import { useDesign } from "@/context/DesignContext";

// Configured options for paint, wallpaper, paneling, and stone
const wallOptions = {
  paint: [
    { id: "white-linen", label: "White Linen", color: "#FAF8F5" },
    { id: "warm-ivory", label: "Warm Ivory", color: "#F5F0E8" },
    { id: "soft-sage", label: "Soft Sage", color: "#C8D5C0" },
    { id: "dusty-blue", label: "Dusty Blue", color: "#B8C9D4" },
    { id: "terracotta", label: "Terracotta", color: "#C4785A" },
    { id: "charcoal", label: "Charcoal", color: "#3A3A3A" },
  ],
  wallpaper: [
    { id: "sage-stripes", label: "Sage Stripes", type: "stripes", color: "#FAF8F5", secondary: "#C8D5C0" },
    { id: "navy-stripes", label: "Navy Stripes", type: "stripes", color: "#2C3E5A", secondary: "#D4C5A9" },
    { id: "grey-diamonds", label: "Grey Diamonds", type: "diamonds", color: "#FAF8F5", secondary: "#9E9E9E" },
    { id: "gold-diamonds", label: "Gold Diamonds", type: "diamonds", color: "#FAF8F5", secondary: "#ffd700" },
  ],
  wood: [
    { id: "wood-light", label: "Light Wood", color: "#E5C594" },
    { id: "wood-natural", label: "Natural Oak", color: "#C4A882" },
    { id: "wood-dark", label: "Dark Walnut", color: "#5C3D2E" },
  ],
  stone: [
    { id: "stone-brick", label: "Grey Brick", color: "#78716c" },
    { id: "stone-slate", label: "Slate Clad", color: "#4b5563" },
    { id: "stone-sand", label: "Sandstone", color: "#d4c5a9" },
  ],
};

const flooringOptions = {
  wood: [
    { id: "light-oak", label: "Light Oak", color: "#E6C594" },
    { id: "dark-walnut", label: "Dark Walnut", color: "#5C3E35" },
    { id: "honey-maple", label: "Honey Maple", color: "#D4B896" },
  ],
  marble: [
    { id: "marble-carrara", label: "Carrara White", color: "#EAE8E4", secondary: "#A0A0A0" },
    { id: "marble-nero", label: "Nero Marquina", color: "#1F2937", secondary: "#6B7280" },
  ],
  tiles: [
    { id: "tile-ceramic", label: "Ceramic White", color: "#FAF8F5", secondary: "#E0E0E0" },
    { id: "tile-slate", label: "Slate Tiles", color: "#374151", secondary: "#111827" },
  ],
  granite: [
    { id: "granite-speckled", label: "Granite Grey", color: "#9CA3AF" },
    { id: "granite-black", label: "Granite Black", color: "#111827" },
  ],
  laminate: [
    { id: "laminate-tan", label: "Natural Tan", color: "#D2B48C" },
    { id: "laminate-grey", label: "Driftwood", color: "#8C7B70" },
  ],
};

const ceilingOptions = [
  { id: "standard", label: "Standard", desc: "Flat gypsum board" },
  { id: "false-ceiling", label: "False Ceiling", desc: "Tiered recessed LED cove" },
  { id: "wooden", label: "Wooden Ceiling", desc: "Timber paneling style" },
];

export default function MaterialsStudio() {
  const { roomMaterials, updateRoomMaterials } = useDesign();

  return (
    <div className="flex flex-col gap-6 px-5 py-4">
      {/* Description header */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
          Materials & Paint Studio
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">
          Customize room surfaces, walls, flooring, and ceilings
        </p>
      </div>

      {/* ── 1. WALL CUSTOMIZATION ── */}
      <section className="border-b border-stone-100 pb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          Walls Finish
        </h4>
        
        {/* Wall Material Type Selector */}
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-stone-100 p-0.5 mb-3.5">
          {[
            { id: "paint", label: "Paint" },
            { id: "wallpaper", label: "Paper" },
            { id: "wood", label: "Wood" },
            { id: "stone", label: "Stone" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => updateRoomMaterials("walls", {
                type: type.id,
                // Assign a sensible default swatch when switching type
                swatchId: wallOptions[type.id][0].id,
                color: wallOptions[type.id][0].color,
                secondary: wallOptions[type.id][0].secondary || null,
                wallpaperType: wallOptions[type.id][0].type || null,
              })}
              className={`rounded-md py-1 text-[10px] font-bold transition-all duration-150 ${
                roomMaterials.walls.type === type.id
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-0.5">
          {wallOptions[roomMaterials.walls.type].map((swatch) => {
            const isSelected = roomMaterials.walls.swatchId === swatch.id;
            return (
              <button
                key={swatch.id}
                onClick={() => updateRoomMaterials("walls", {
                  swatchId: swatch.id,
                  color: swatch.color,
                  secondary: swatch.secondary || null,
                  wallpaperType: swatch.type || null,
                })}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all duration-200 ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/20 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                {/* Visual Swatch Color */}
                <div
                  className="h-8 w-8 rounded-full border border-stone-200 shadow-sm relative overflow-hidden"
                  style={{ backgroundColor: swatch.color }}
                >
                  {/* Decorative representation of patterns */}
                  {roomMaterials.walls.type === "wallpaper" && (
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: swatch.type === "stripes"
                          ? `repeating-linear-gradient(90deg, ${swatch.secondary} 0px, ${swatch.secondary} 4px, transparent 4px, transparent 8px)`
                          : `radial-gradient(circle, ${swatch.secondary} 2px, transparent 3px)`,
                        backgroundSize: "8px 8px"
                      }}
                    />
                  )}
                  {roomMaterials.walls.type === "wood" && (
                    <div className="absolute inset-0 opacity-20 bg-black repeating-linear-gradient-90"
                         style={{ backgroundImage: `repeating-linear-gradient(90deg, #000 0px, #000 3px, transparent 3px, transparent 10px)` }}
                    />
                  )}
                  {roomMaterials.walls.type === "stone" && (
                    <div className="absolute inset-0 opacity-35"
                         style={{ backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 5px)` }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-stone-700 truncate w-full">
                  {swatch.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 2. FLOOR CUSTOMIZATION ── */}
      <section className="border-b border-stone-100 pb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          Flooring Material
        </h4>

        {/* Flooring Type Selector */}
        <div className="grid grid-cols-5 gap-0.5 rounded-lg bg-stone-100 p-0.5 mb-3.5">
          {[
            { id: "wood", label: "Wood" },
            { id: "marble", label: "Marble" },
            { id: "tiles", label: "Tiles" },
            { id: "granite", label: "Granite" },
            { id: "laminate", label: "Lam." },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => updateRoomMaterials("flooring", {
                type: type.id,
                swatchId: flooringOptions[type.id][0].id,
                color: flooringOptions[type.id][0].color,
                secondary: flooringOptions[type.id][0].secondary || null,
              })}
              className={`rounded-md py-1 text-[10px] font-bold transition-all duration-150 ${
                roomMaterials.flooring.type === type.id
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-0.5">
          {flooringOptions[roomMaterials.flooring.type].map((swatch) => {
            const isSelected = roomMaterials.flooring.swatchId === swatch.id;
            return (
              <button
                key={swatch.id}
                onClick={() => updateRoomMaterials("flooring", {
                  swatchId: swatch.id,
                  color: swatch.color,
                  secondary: swatch.secondary || null,
                })}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all duration-200 ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/20 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                {/* Visual Swatch Color */}
                <div
                  className="h-8 w-8 rounded-md border border-stone-200 shadow-sm relative overflow-hidden"
                  style={{ backgroundColor: swatch.color }}
                >
                  {/* Decorative representation of patterns */}
                  {roomMaterials.flooring.type === "wood" && (
                    <div className="absolute inset-0 opacity-20"
                         style={{ backgroundImage: `repeating-linear-gradient(90deg, #000 0px, #000 4px, transparent 4px, transparent 15px)` }}
                    />
                  )}
                  {roomMaterials.flooring.type === "tiles" && (
                    <div className="absolute inset-0 opacity-20 border border-black/40" />
                  )}
                  {roomMaterials.flooring.type === "marble" && (
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-black via-transparent to-black" />
                  )}
                  {roomMaterials.flooring.type === "granite" && (
                    <div className="absolute inset-0 opacity-30"
                         style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: "3px 3px" }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-stone-700 truncate w-full">
                  {swatch.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. CEILING CUSTOMIZATION ── */}
      <section className="pb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          Ceiling Architecture & Finish
        </h4>

        {/* Options List */}
        <div className="flex flex-col gap-2">
          {ceilingOptions.map((opt) => {
            const isSelected = roomMaterials.ceiling.type === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => updateRoomMaterials("ceiling", {
                  type: opt.id,
                  // Ceiling color defaults to linen/white, wood ceiling borrows timber color
                  color: opt.id === "wooden" ? "#C4A882" : "#FAF8F5",
                })}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/20 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${isSelected ? "text-brand-800" : "text-stone-800"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {opt.desc}
                  </p>
                </div>
                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="h-5 w-5 rounded-full border border-stone-200 bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
