"use client";

import React, { useState, useMemo } from "react";
import { useDesign } from "@/context/DesignContext";
import { calculateProjectCost } from "@/lib/pricingService";

const QUALITY_LEVELS = [
  { id: "basic", name: "Basic", description: "Standard builder-grade finishes", multiplier: "1.0x" },
  { id: "premium", name: "Premium", description: "High-quality design store styles", multiplier: "1.8x" },
  { id: "luxury", name: "Luxury", description: "Bespoke woods, stone & imports", multiplier: "3.2x" },
];

export default function BudgetEstimatorModal({ onClose }) {
  const { roomsList } = useDesign();
  
  // Local Settings
  const [budgetTarget, setBudgetTarget] = useState(15000);
  const [qualityLevel, setQualityLevel] = useState("premium");
  const [activeTab, setActiveTab] = useState("categories"); // "categories" | "rooms" | "items"

  // Calculate Costs
  const costReport = useMemo(() => {
    return calculateProjectCost(roomsList, qualityLevel);
  }, [roomsList, qualityLevel]);

  const { total, breakdown, roomCosts, itemized } = costReport;

  // Budget comparison math
  const budgetUtilization = Math.round((total / budgetTarget) * 100);
  const isOverBudget = total > budgetTarget;
  const budgetDifference = Math.abs(total - budgetTarget);

  // Generate budget saving suggestions
  const budgetTips = useMemo(() => {
    const tips = [];
    if (qualityLevel === "luxury") {
      tips.push("Downgrade from Luxury to Premium quality level to save approximately 44% of costs.");
    } else if (qualityLevel === "premium") {
      tips.push("Downgrade from Premium to Basic quality level to save approximately 45% of costs.");
    }

    const furnitureItemsCount = roomsList.flatMap(r => r.furnitureItems).length;
    if (furnitureItemsCount > 10) {
      tips.push("Consider removing non-essential accent furniture or secondary lighting fixtures.");
    }

    const hasMarble = roomsList.some(r => r.roomMaterials?.flooring?.swatchId === "marble-white");
    if (hasMarble) {
      tips.push("Swap luxury White Marble flooring with Natural Oak or Concrete for a budget-friendly alternative.");
    }

    if (tips.length === 0) {
      tips.push("Your design is highly optimized! No specific suggestions needed.");
    }

    return tips;
  }, [qualityLevel, roomsList]);

  // Export to CSV helper
  const handleExportCSV = () => {
    try {
      const headers = ["Item Name", "Category", "Room", "Quantity", "Unit Price ($)", "Total Price ($)"];
      const rows = itemized.map(item => [
        `"${item.name}"`,
        `"${item.category}"`,
        `"${item.room}"`,
        item.qty,
        item.unitPrice,
        item.totalPrice
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `budget_estimate_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("CSV Export failed:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 shrink-0 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700 text-sm shadow-inner">
              💰
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-stone-900">
                Budget & Cost Estimator
              </h3>
              <p className="text-[10px] text-stone-400 mt-0.5">
                Real-time pricing analysis across all active layout rooms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-450 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Modal Body Grid ── */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-150">
          
          {/* Left Column: Budget Controls & Gauge */}
          <div className="md:w-5/12 p-6 flex flex-col gap-6 select-none shrink-0">
            
            {/* 1. Quality Level selector */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                1. Select Material Quality Level
              </h4>
              <div className="flex flex-col gap-2">
                {QUALITY_LEVELS.map((lvl) => {
                  const isSel = qualityLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setQualityLevel(lvl.id)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        isSel
                          ? "border-brand-600 bg-brand-50/50 shadow-xs"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-stone-800">{lvl.name}</span>
                        <p className="text-[10px] text-stone-400 mt-0.5">{lvl.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSel ? "bg-brand-100 text-brand-700" : "bg-stone-100 text-stone-500"
                      }`}>
                        {lvl.multiplier}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Target Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  2. Define Target Budget limit
                </h4>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                  ${budgetTarget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={budgetTarget}
                onChange={(e) => setBudgetTarget(parseInt(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer h-1.5 bg-stone-150 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[8px] font-semibold text-stone-400 mt-1">
                <span>$1K</span>
                <span>$25K</span>
                <span>$50K</span>
              </div>
            </div>

            {/* 3. Budget Utilization Progress */}
            <div className={`rounded-xl border p-4 shadow-xs flex flex-col items-center text-center ${
              isOverBudget ? "border-red-200 bg-red-50/30" : "border-emerald-200 bg-emerald-50/20"
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isOverBudget ? "text-red-700" : "text-emerald-700"
              }`}>
                {isOverBudget ? "⚠️ Over Budget limit" : "✅ Under Budget"}
              </span>

              {/* Progress visual bar */}
              <div className="w-full bg-stone-200/80 h-3 rounded-full mt-3 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverBudget ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-[10px] font-semibold text-stone-400 mt-1.5 px-0.5">
                <span>{budgetUtilization}% Used</span>
                <span>Limit: ${budgetTarget.toLocaleString()}</span>
              </div>

              <p className="mt-3 text-xs text-stone-500 max-w-[240px]">
                {isOverBudget ? (
                  <>Your layout exceeds the budget limit by <span className="font-bold text-red-650">${budgetDifference.toLocaleString()}</span>.</>
                ) : (
                  <>You have <span className="font-bold text-emerald-700">${budgetDifference.toLocaleString()}</span> left in your target budget.</>
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Breakdown & Itemized Details */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
            
            {/* Top overview metrics */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-xs">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Total Estimated Cost</span>
                <p className="text-xl font-bold font-display text-stone-850 mt-0.5">${total.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-xs">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Items Placed</span>
                <p className="text-xl font-bold font-display text-stone-850 mt-0.5">{itemized.length}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-150 shrink-0">
              {[
                { id: "categories", name: "Category breakdown" },
                { id: "rooms", name: "Room-wise sums" },
                { id: "items", name: "Itemized invoice" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-brand-700 text-brand-700"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab content area */}
            <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[380px]">
              
              {/* Category Breakdown Tab */}
              {activeTab === "categories" && (
                <div className="flex flex-col gap-2.5 py-1">
                  {[
                    { key: "furniture", label: "Furniture elements", icon: "🛋️" },
                    { key: "lighting", label: "Lighting fixtures", icon: "💡" },
                    { key: "materials", label: "Wall materials / Paint", icon: "🎨" },
                    { key: "flooring", label: "Flooring patterns", icon: "🪵" },
                    { key: "doors", label: "Room Doors", icon: "🚪" },
                    { key: "windows", label: "Large Windows", icon: "🪟" },
                    { key: "curtains", label: "Window Curtains", icon: "🧣" },
                  ].map((cat) => {
                    const cost = breakdown[cat.key] || 0;
                    const percent = total > 0 ? Math.round((cost / total) * 100) : 0;
                    return (
                      <div key={cat.key} className="flex items-center justify-between rounded-xl border border-stone-150 p-3.5 bg-white shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm shrink-0">{cat.icon}</span>
                          <span className="text-xs font-semibold text-stone-750">{cat.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-stone-850">${cost.toLocaleString()}</span>
                          <span className="text-[9px] text-stone-400 block font-medium mt-0.5">{percent}% of total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Room-Wise sums Tab */}
              {activeTab === "rooms" && (
                <div className="flex flex-col gap-2.5 py-1">
                  {roomCosts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center">
                      <p className="text-xs text-stone-400">No rooms active in this design layout.</p>
                    </div>
                  ) : (
                    roomCosts.map((room) => {
                      const percent = total > 0 ? Math.round((room.cost / total) * 100) : 0;
                      return (
                        <div key={room.roomId} className="flex items-center justify-between rounded-xl border border-stone-150 p-3.5 bg-white shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🏠</span>
                            <span className="text-xs font-semibold text-stone-750">{room.roomName}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-stone-850">${room.cost.toLocaleString()}</span>
                            <span className="text-[9px] text-stone-400 block font-medium mt-0.5">{percent}% of total</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Itemized Invoice Ledger Tab */}
              {activeTab === "items" && (
                <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-[9px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-150">
                          <th className="px-4 py-2.5">Item</th>
                          <th className="px-3 py-2.5">Category</th>
                          <th className="px-3 py-2.5">Room</th>
                          <th className="px-4 py-2.5 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-[10px]">
                        {itemized.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-stone-450 font-medium">
                              No materials or furniture placed yet.
                            </td>
                          </tr>
                        ) : (
                          itemized.map((item, idx) => (
                            <tr key={idx} className="hover:bg-stone-50/50">
                              <td className="px-4 py-2 font-semibold text-stone-800">{item.name}</td>
                              <td className="px-3 py-2 text-stone-500">{item.category}</td>
                              <td className="px-3 py-2 text-stone-500 max-w-[100px] truncate" title={item.room}>{item.room}</td>
                              <td className="px-4 py-2 text-right font-bold text-stone-700">${item.totalPrice.toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Warning alerts advice boxes */}
            {isOverBudget && (
              <div className="rounded-xl border border-red-150 bg-red-50/40 p-3 shrink-0 flex items-start gap-2.5 select-none animate-in fade-in duration-200">
                <span className="text-red-500 text-base mt-0.5">💡</span>
                <div>
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">AI Saving Advice</p>
                  <ul className="list-disc pl-3 text-[10px] text-red-700/80 mt-1 flex flex-col gap-0.5 leading-normal">
                    {budgetTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-100 px-6 py-4 shrink-0 bg-stone-50/50">
          {itemized.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-650 hover:bg-stone-50 hover:text-stone-800 transition-colors flex items-center gap-1.5"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Estimate (.CSV)
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white hover:bg-stone-805 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
