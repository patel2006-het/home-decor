"use client";

import React from "react";
import { useDesign } from "@/context/DesignContext";
import { calculateProjectCost } from "@/lib/pricingService";

export default function PrintableReport() {
  const {
    activeProjectName,
    roomsList,
    selectedStyle,
  } = useDesign();

  // Run the pricing service to get full invoice breakdown
  const costReport = React.useMemo(() => {
    return calculateProjectCost(roomsList, "premium");
  }, [roomsList]);

  if (!roomsList || roomsList.length === 0) return null;

  const styleName = selectedStyle?.name || selectedStyle || "Modern";
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div id="printable-report" className="hidden font-sans text-stone-900 bg-white p-8">
      {/* ── 1. Document Header ── */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
            Haven<span className="text-[#7a6349]">Decor</span>
          </h1>
          <p className="text-xs text-stone-450 uppercase tracking-widest mt-1">
            Professional Design Report
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Date Generated</p>
          <p className="text-sm font-bold text-stone-800">{currentDate}</p>
        </div>
      </div>

      {/* ── 2. Project Summary Banner ── */}
      <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-5 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">
          Project Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Project Name</p>
            <p className="text-sm font-bold text-stone-850 truncate">{activeProjectName || "Untitled Design"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Design Style</p>
            <p className="text-sm font-bold text-stone-850">{styleName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Rooms</p>
            <p className="text-sm font-bold text-stone-850">{roomsList.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Budget</p>
            <p className="text-sm font-extrabold text-[#7a6349]">${costReport.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── 3. Budget Estimate Invoice ── */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-stone-850 mb-3 pb-1 border-b border-stone-100">
          Budget Estimate Invoice
        </h2>
        <table className="w-full text-xs mb-4">
          <thead>
            <tr className="bg-stone-50 border-y border-stone-200">
              <th className="font-semibold py-2 px-3">Expense Category</th>
              <th className="font-semibold py-2 px-3 text-right">Cost Apportioned ($)</th>
              <th className="font-semibold py-2 px-3 text-right">Percentage Allocation</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Furniture Inventory", val: costReport.breakdown.furniture },
              { label: "Wall Paints & Plaster", val: costReport.breakdown.materials },
              { label: "Flooring Installation", val: costReport.breakdown.flooring },
              { label: "Lighting & Fixtures", val: costReport.breakdown.lighting },
              { label: "Window Curtains", val: costReport.breakdown.curtains },
              { label: "Doors Elements", val: costReport.breakdown.doors },
              { label: "Windows Elements", val: costReport.breakdown.windows },
            ].map((cat, idx) => {
              if (cat.val === 0) return null;
              const pct = ((cat.val / costReport.total) * 100).toFixed(1);
              return (
                <tr key={idx} className="border-b border-stone-100">
                  <td className="py-2.5 px-3 font-medium text-stone-700">{cat.label}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-stone-850">${cat.val.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-stone-550">{pct}%</td>
                </tr>
              );
            })}
            <tr className="bg-stone-50 border-t border-stone-200">
              <td className="py-3 px-3 font-bold text-stone-900">Grand Project Total</td>
              <td className="py-3 px-3 text-right font-black text-[#7a6349] text-sm">${costReport.total.toLocaleString()}</td>
              <td className="py-3 px-3 text-right font-bold text-stone-700">100.0%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 4. Room-by-Room Layout Details ── */}
      <div className="page-break" />
      <div className="mb-8">
        <h2 className="text-lg font-bold text-stone-850 mb-4 pb-1 border-b border-stone-100">
          Room Specifications & Layouts
        </h2>

        {roomsList.map((room, roomIdx) => {
          const roomTotal = costReport.roomCosts.find((r) => r.roomId === room.id)?.cost || 0;
          const placedItems = room.furnitureItems || [];
          const lighting = room.globalLighting || { ambientIntensity: 0.5, ambientTemp: 3000, directionalIntensity: 1.0 };
          
          return (
            <div key={room.id} className={`p-5 border border-stone-200 rounded-2xl bg-white mb-6 ${roomIdx > 0 ? "page-break-before" : ""}`}>
              <div className="flex items-start justify-between border-b border-stone-100 pb-3 mb-4">
                <div>
                  <h3 className="text-md font-bold text-stone-950">{room.name}</h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">
                    Room Type: {room.type.replace("-", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                    Room Cost: ${roomTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Room materials */}
              <div className="grid grid-cols-2 gap-4 mb-5 text-xs">
                <div>
                  <h4 className="font-bold text-stone-500 uppercase tracking-wider text-[9px] mb-1.5">
                    🎨 Finishes & Materials
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex justify-between border-b border-stone-50 pb-1">
                      <span className="text-stone-500">Wall Paint Swatch:</span>
                      <span className="font-bold text-stone-700">{room.roomMaterials?.walls?.swatchId || "Standard White"} ({room.roomMaterials?.walls?.color || "#FAF8F5"})</span>
                    </li>
                    <li className="flex justify-between pb-1">
                      <span className="text-stone-500">Flooring Finishing:</span>
                      <span className="font-bold text-stone-700">{room.roomMaterials?.flooring?.swatchId || "Light Oak"}</span>
                    </li>
                  </ul>
                </div>

                {/* Lighting setup */}
                <div>
                  <h4 className="font-bold text-stone-500 uppercase tracking-wider text-[9px] mb-1.5">
                    💡 Global Lighting Configuration
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex justify-between border-b border-stone-50 pb-1">
                      <span className="text-stone-500">Ambient Fill Brightness:</span>
                      <span className="font-bold text-stone-700">{Math.round((lighting.ambientIntensity ?? 0.5) * 100)}%</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-50 pb-1">
                      <span className="text-stone-500">Ambient Warmth:</span>
                      <span className="font-bold text-stone-700">{lighting.ambientTemp ?? 3000}K</span>
                    </li>
                    <li className="flex justify-between pb-1">
                      <span className="text-stone-500">Sunlight Intensity:</span>
                      <span className="font-bold text-stone-700">{Math.round((lighting.directionalIntensity ?? 1.0) * 100)}%</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Furniture List table */}
              <div>
                <h4 className="font-bold text-stone-500 uppercase tracking-wider text-[9px] mb-2">
                  🛋️ Placed Elements & Furniture
                </h4>
                {placedItems.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No furniture or elements placed in this room.</p>
                ) : (
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="bg-stone-50 border-y border-stone-200">
                        <th className="py-2 px-2.5 font-bold">Element Name</th>
                        <th className="py-2 px-2.5 font-bold">Category</th>
                        <th className="py-2 px-2.5 font-bold">Brand</th>
                        <th className="py-2 px-2.5 font-bold">Dimensions (W×H×D)</th>
                        <th className="py-2 px-2.5 font-bold text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placedItems.map((item) => {
                        // Estimate dimensions
                        const dim = item.dimensions
                          ? `${item.dimensions.width}×${item.dimensions.height}×${item.dimensions.depth} cm`
                          : `${item.width || 100}×${item.height || 70}×- cm`;

                        const itemCost = item.price !== undefined ? item.price : 0; // standard print price is computed, but let's show pricingService mapped rates
                        // Resolve default pricing since items array lacks exact cost scaling, or grab from itemized
                        const priceFromInvoice = costReport.itemized.find(
                          (invoice) => invoice.name === item.name && invoice.room === room.name
                        )?.unitPrice ?? 0;

                        return (
                          <tr key={item.instanceId} className="border-b border-stone-100">
                            <td className="py-2 px-2.5 font-semibold text-stone-800">{item.name}</td>
                            <td className="py-2 px-2.5 text-stone-500 uppercase text-[9px] font-bold">{item.category}</td>
                            <td className="py-2 px-2.5 text-stone-600 font-medium">{item.brand || "HavenDecor"}</td>
                            <td className="py-2 px-2.5 text-stone-500">{dim}</td>
                            <td className="py-2 px-2.5 text-right font-bold text-stone-850">${priceFromInvoice.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 5. Footer Terms ── */}
      <div className="border-t border-stone-200 pt-5 mt-12 text-center text-[10px] text-stone-400">
        <p>This design report was professionally compiled by HavenDecor. Pricing approximations are retail estimates.</p>
        <p className="mt-1">© {new Date().getFullYear()} HavenDecor. All rights reserved.</p>
      </div>
    </div>
  );
}
