"use client";

import { useState, useMemo } from "react";
import { useDesign } from "@/context/DesignContext";
import { marketplaceProducts } from "@/lib/marketplaceData";

export default function MarketplaceSwapModal({ isOpen, onClose, selectedInstance }) {
  const { swapFurnitureItem } = useDesign();
  const [searchQuery, setSearchQuery] = useState("");

  // Determine marketplace categories mapping for the active selected item
  const mappedCategories = useMemo(() => {
    if (!selectedInstance) return [];
    const cat = selectedInstance.category?.toLowerCase() || "";
    const itemId = selectedInstance.id?.toLowerCase() || "";

    if (cat === "sleeping") return ["Beds"];
    if (cat === "seating") {
      if (itemId.includes("sofa")) return ["Sofas"];
      if (itemId.includes("chair") || itemId.includes("stool")) return ["Chairs"];
      return ["Sofas", "Chairs"];
    }
    if (cat === "tables") return ["Dining Tables"];
    if (cat === "storage") {
      if (itemId.includes("tv") || itemId.includes("media") || itemId.includes("console")) return ["TV Units"];
      return ["Wardrobes"];
    }
    if (cat === "curtain" || selectedInstance.type === "Curtain") return ["Curtains"];
    if (cat === "lighting" || selectedInstance.isLight) return ["Lighting"];
    return [];
  }, [selectedInstance]);

  // Filter products by category mapping and search query
  const matchingProducts = useMemo(() => {
    if (!selectedInstance) return [];
    
    // First pass: Filter products belonging to the matched category group
    let list = marketplaceProducts.filter((product) =>
      mappedCategories.includes(product.category)
    );

    // If no category match was resolved, fallback to showing all items
    if (list.length === 0) {
      list = marketplaceProducts;
    }

    // Second pass: Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (prod) =>
          prod.name.toLowerCase().includes(query) ||
          prod.brand.toLowerCase().includes(query) ||
          prod.description.toLowerCase().includes(query)
      );
    }

    return list;
  }, [selectedInstance, mappedCategories, searchQuery]);

  if (!isOpen || !selectedInstance) return null;

  const handleSwap = (product) => {
    swapFurnitureItem(selectedInstance.instanceId, product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="h-full w-full max-w-lg border-l border-stone-200 bg-white p-6 shadow-2xl flex flex-col animate-slide-in relative">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>🛒 Swap with Real Product</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Select a branded alternative for <strong className="font-semibold">{selectedInstance.name}</strong>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search West Elm, IKEA, Pottery Barn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2 pl-9 pr-3 text-xs font-medium text-stone-700 placeholder-stone-400 outline-none focus:border-brand-500 focus:bg-white"
            />
            <svg
              className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Pill Indicator */}
        <div className="mb-4 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-stone-450 uppercase tracking-wider">
            Matching Categories:
          </span>
          {mappedCategories.map((c) => (
            <span key={c} className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-[10px] font-bold text-brand-700">
              {c}
            </span>
          ))}
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {matchingProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center">
              <p className="text-xs text-stone-400">
                No matching branded alternatives found.
              </p>
            </div>
          ) : (
            matchingProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSwap(product)}
                className="group flex cursor-pointer gap-4 rounded-xl border border-stone-200 p-3.5 bg-white transition-all duration-200 hover:border-brand-300 hover:shadow-sm"
              >
                {/* Image */}
                <div className="h-16 w-16 shrink-0 rounded-lg bg-stone-50 flex items-center justify-center p-1.5 border border-stone-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xl">🛋️</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-stone-850 truncate group-hover:text-brand-700 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-xs font-black text-brand-700 shrink-0">
                      ${product.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                      {product.brand}
                    </span>
                    <span className="text-[9px] text-stone-300">•</span>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[10px] text-stone-500 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Dimensions specs */}
                  <div className="mt-3.5 border-t border-stone-100/70 pt-2 flex items-center justify-between text-[9px] text-stone-400 font-semibold uppercase tracking-wider">
                    <span>Dimensions (W×H×D)</span>
                    <span className="font-bold text-stone-600 normal-case">
                      {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
