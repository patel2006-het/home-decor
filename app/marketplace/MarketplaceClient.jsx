"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { marketplaceProducts } from "@/lib/marketplaceData";

const CATEGORIES = [
  "All",
  "Sofas",
  "Beds",
  "Chairs",
  "Wardrobes",
  "Dining Tables",
  "TV Units",
  "Curtains",
  "Lighting",
];

const BRANDS = ["IKEA", "West Elm", "Pottery Barn", "Article"];

const CATEGORY_TO_ROOM = {
  Sofas: "living-room",
  Beds: "bedroom",
  Chairs: "living-room",
  Wardrobes: "bedroom",
  "Dining Tables": "dining-room",
  "TV Units": "living-room",
  Curtains: "living-room",
  Lighting: "living-room",
};

export default function MarketplaceClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);

  // Toggle brand selection
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrands([]);
    setMaxPrice(2000);
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return marketplaceProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedBrands, maxPrice]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero header section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          Haven <span className="text-brand-600">Marketplace</span>
        </h1>
        <p className="mt-2 text-sm text-stone-500 max-w-2xl">
          Browse real branded furniture items with precise dimensions. Visualize them inside the 3D Design Studio to see exactly how they fit your physical home layout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left column: Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white/70 backdrop-blur-md p-5 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-brand-650 hover:text-brand-800 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label htmlFor="search" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Search Product
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Sofa, bed, lamp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2 pl-9 pr-3 text-xs font-medium text-stone-700 placeholder-stone-400 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                />
                <svg
                  className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Select (Dropdown on mobile, list on desktop) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Category
              </label>
              <div className="hidden lg:flex flex-col gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-650" />
                    )}
                  </button>
                ))}
              </div>
              <div className="lg:hidden">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs font-medium text-stone-700 outline-none focus:border-brand-500 focus:bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brands Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Brand
              </label>
              <div className="space-y-2">
                {BRANDS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2.5 text-xs font-medium text-stone-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="h-3.5 w-3.5 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="price" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-xs font-semibold text-stone-850">
                  ${maxPrice}
                </span>
              </div>
              <input
                id="price"
                type="range"
                min="50"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-brand-600 bg-stone-100 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium">
                <span>$50</span>
                <span>$2000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right column: Product Grid */}
        <section className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-white/50 p-16 text-center shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-stone-900">
                No products found
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                Try loosening your filters or typing a different search query.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const roomSlug = CATEGORY_TO_ROOM[product.category] || "living-room";
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-md"
                  >
                    {/* Image container */}
                    <div className="relative aspect-square w-full bg-stone-50 flex items-center justify-center p-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain transition-transform duration-350 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-4xl text-stone-300">🛋️</span>
                      )}
                      
                      {/* Brand Badge */}
                      <span className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px]">
                        {product.brand}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="text-xs font-black text-brand-700">
                          ${product.price}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                        {product.category}
                      </p>

                      <p className="mt-2 text-xs text-stone-500 line-clamp-2 flex-1">
                        {product.description}
                      </p>

                      {/* Dimension Specs */}
                      <div className="mt-4 border-t border-stone-100 pt-3 text-[10px] text-stone-400 font-medium">
                        <div className="flex justify-between">
                          <span>Dimensions (W×H×D)</span>
                          <span className="font-bold text-stone-600">
                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex gap-1.5">
                        <Link
                          href={`/select-style?room=${roomSlug}`}
                          className="flex-1 rounded-xl bg-brand-700 py-2.5 text-center text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-brand-800"
                        >
                          Customize in Studio
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
