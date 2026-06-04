"use client";

import React, { useMemo } from "react";
import { useDesign } from "@/context/DesignContext";
import { calculateProjectCost } from "@/lib/pricingService";

export default function ExportCenterModal({ isOpen, onClose }) {
  const {
    activeProjectName,
    roomsList,
    selectedStyle,
  } = useDesign();

  // Run the pricing engine
  const costReport = useMemo(() => {
    return calculateProjectCost(roomsList, "premium");
  }, [roomsList]);

  if (!isOpen) return null;

  // 1. Export Design Report as PDF (launches window.print)
  const handleExportPDF = () => {
    window.print();
  };

  // 2. Export 3D View as Image (PNG/JPEG)
  const handleExportImage = (format = "png") => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      alert("Error: 3D canvas rendering context could not be captured. Please make sure the 3D editor is loaded.");
      return;
    }

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const extension = format === "jpeg" ? "jpg" : "png";

    try {
      const dataUrl = canvas.toDataURL(mimeType, format === "jpeg" ? 0.9 : undefined);
      const link = document.createElement("a");
      link.download = `${activeProjectName || "HavenDecor-Design"}-canvas.${extension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to capture WebGL context:", err);
      alert("Error: Failed to capture 3D view. WebGL canvas buffer may not be preserved.");
    }
  };

  // 3. Export Shopping List as CSV
  const handleExportCSV = () => {
    try {
      let csvContent = "\uFEFF"; // Add BOM for UTF-8 compatibility with Excel
      csvContent += "Room Name,Item Name,Category,Brand,Price,Dimensions (W x H x D in cm)\n";

      roomsList.forEach((room) => {
        const roomName = (room.name || `Room (${room.type})`).replace(/"/g, '""');
        const items = room.furnitureItems || [];

        items.forEach((item) => {
          const itemName = (item.name || "").replace(/"/g, '""');
          const category = (item.category || "").replace(/"/g, '""');
          const brand = (item.brand || "HavenDecor").replace(/"/g, '""');
          
          // Resolve exact retail price from invoice ledger
          const itemPrice = costReport.itemized.find(
            (invoice) => invoice.name === item.name && invoice.room === room.name
          )?.unitPrice ?? 0;

          const dims = item.dimensions
            ? `${item.dimensions.width}x${item.dimensions.height}x${item.dimensions.depth}`
            : `${item.width || 100}x${item.height || 70}x-`;

          csvContent += `"${roomName}","${itemName}","${category}","${brand}",${itemPrice},"${dims}"\n`;
        });
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${activeProjectName || "HavenDecor-Design"}-shopping-list.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV compilation error:", err);
    }
  };

  // 4. Export Project Summary Details as JSON
  const handleExportJSON = () => {
    try {
      const summary = {
        projectName: activeProjectName || "Untitled Design",
        exportedAt: new Date().toISOString(),
        selectedStyle: selectedStyle?.name || selectedStyle || "Modern",
        roomsCount: roomsList.length,
        totalBudget: costReport.total,
        rooms: roomsList.map((room) => ({
          roomName: room.name,
          roomType: room.type,
          wallColor: room.roomMaterials?.walls,
          flooring: room.roomMaterials?.flooring,
          furnitureCount: room.furnitureItems.length,
          furniture: room.furnitureItems.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            brand: item.brand || "HavenDecor",
            price: item.price,
            dimensions: item.dimensions,
            position: item.position,
            rotation: item.rotation,
            scale: item.scale,
          })),
        })),
      };

      const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${activeProjectName || "HavenDecor"}-config.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("JSON backup error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in no-print">
      <div className="w-full max-w-2xl rounded-2xl border border-brand-200 bg-white p-6 shadow-2xl animate-scale-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-755 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Title */}
        <div className="mb-6 border-b border-stone-100 pb-3">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>📦 Export Center</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Export, print, or save your multi-room design layouts and cost reports.
          </p>
        </div>

        {/* Export Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 max-h-[380px] overflow-y-auto pr-1">
          {/* A4 Printable Design Report */}
          <div
            onClick={handleExportPDF}
            className="group flex flex-col justify-between cursor-pointer rounded-xl border border-stone-200 p-4 bg-white transition-all duration-200 hover:border-brand-350 hover:shadow-sm hover:bg-brand-50/10"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-lg group-hover:scale-105 transition-transform">
                📄
              </div>
              <h3 className="text-xs font-bold text-stone-850 mt-3">PDF Design Report</h3>
              <p className="text-[10px] text-stone-500 mt-1">
                Generates a printable PDF detailing room specifications, materials, placed furniture, and itemized budget.
              </p>
            </div>
            <span className="text-[10px] font-bold text-brand-650 group-hover:text-brand-800 mt-4 flex items-center gap-1">
              Print / Save PDF →
            </span>
          </div>

          {/* 3D Canvas PNG Export */}
          <div
            onClick={() => handleExportImage("png")}
            className="group flex flex-col justify-between cursor-pointer rounded-xl border border-stone-200 p-4 bg-white transition-all duration-200 hover:border-brand-350 hover:shadow-sm hover:bg-brand-50/10"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-lg group-hover:scale-105 transition-transform">
                🖼️
              </div>
              <h3 className="text-xs font-bold text-stone-850 mt-3">Export as PNG</h3>
              <p className="text-[10px] text-stone-500 mt-1">
                Captures a high-resolution, lossless PNG image of the current 3D editor view.
              </p>
            </div>
            <span className="text-[10px] font-bold text-brand-650 group-hover:text-brand-800 mt-4 flex items-center gap-1">
              Download PNG →
            </span>
          </div>

          {/* 3D Canvas JPEG Export */}
          <div
            onClick={() => handleExportImage("jpeg")}
            className="group flex flex-col justify-between cursor-pointer rounded-xl border border-stone-200 p-4 bg-white transition-all duration-200 hover:border-brand-350 hover:shadow-sm hover:bg-brand-50/10"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-lg group-hover:scale-105 transition-transform">
                📷
              </div>
              <h3 className="text-xs font-bold text-stone-850 mt-3">Export as JPEG</h3>
              <p className="text-[10px] text-stone-500 mt-1">
                Captures a compressed, high-resolution JPEG snapshot of the 3D room canvas.
              </p>
            </div>
            <span className="text-[10px] font-bold text-brand-650 group-hover:text-brand-800 mt-4 flex items-center gap-1">
              Download JPEG →
            </span>
          </div>

          {/* Excel/CSV Shopping List */}
          <div
            onClick={handleExportCSV}
            className="group flex flex-col justify-between cursor-pointer rounded-xl border border-stone-200 p-4 bg-white transition-all duration-200 hover:border-brand-350 hover:shadow-sm hover:bg-brand-50/10"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-lg group-hover:scale-105 transition-transform">
                📊
              </div>
              <h3 className="text-xs font-bold text-stone-850 mt-3">Shopping List (CSV)</h3>
              <p className="text-[10px] text-stone-500 mt-1">
                Exports all items in your rooms as a structured CSV spreadsheet showing brands, categories, prices, and sizes.
              </p>
            </div>
            <span className="text-[10px] font-bold text-brand-650 group-hover:text-brand-800 mt-4 flex items-center gap-1">
              Download CSV →
            </span>
          </div>

          {/* Portable JSON config backup */}
          <div
            onClick={handleExportJSON}
            className="group flex flex-col justify-between cursor-pointer rounded-xl border border-stone-200 p-4 bg-white transition-all duration-200 hover:border-brand-350 hover:shadow-sm hover:bg-brand-50/10"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-lg group-hover:scale-105 transition-transform">
                ⚙️
              </div>
              <h3 className="text-xs font-bold text-stone-850 mt-3">Project Configuration</h3>
              <p className="text-[10px] text-stone-500 mt-1">
                Downloads a raw JSON file containing rooms list metadata and coordinates for backup/portable loading.
              </p>
            </div>
            <span className="text-[10px] font-bold text-brand-650 group-hover:text-brand-800 mt-4 flex items-center gap-1">
              Download JSON →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
