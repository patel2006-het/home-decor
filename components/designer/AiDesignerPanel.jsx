"use client";

import { useState } from "react";
import { useDesign } from "@/context/DesignContext";

const PRESET_TAGS = ["Cozy", "Spacious", "Organized", "Bright", "Moody", "Elegant"];
const STYLES = [
  { id: "scandinavian", name: "Scandinavian Cozy", icon: "🌾" },
  { id: "midcentury", name: "Mid-Century Modern", icon: "🪵" },
  { id: "industrial", name: "Industrial Loft", icon: "🧱" },
  { id: "minimalist", name: "Minimalist Zen", icon: "🎋" },
];

export default function AiDesignerPanel() {
  const { roomsList, activeRoomId, applyAiSuggestions } = useDesign();
  
  // Form State
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("scandinavian");
  
  // UI Flow State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const activeRoomObj = roomsList.find((r) => r.id === activeRoomId) || roomsList[0];
  const roomType = activeRoomObj?.type || "living-room";

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType,
          description,
          preferences: selectedTags.join(", ") || "Balanced design",
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI recommendations");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result?.recommendations) return;
    applyAiSuggestions(result.recommendations, replaceExisting);
  };

  const handleCopyPrompt = () => {
    if (!result?.imagePrompt) return;
    navigator.clipboard.writeText(result.imagePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 px-1 py-1">
      {/* ── HEADER ── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-700 flex items-center gap-1.5">
          ✨ AI Design Assistant
        </h3>
        <p className="text-[11px] text-stone-400 mt-1">
          Generate smart furniture layouts, lighting schemes, and paint palettes customized by artificial intelligence.
        </p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          {/* Room Description */}
          <div>
            <label htmlFor="ai-desc" className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Room Description
            </label>
            <textarea
              id="ai-desc"
              rows={3}
              placeholder="e.g. A sunlit workspace with lots of plants, a desk, and a cozy reading corner."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-medium text-stone-700 placeholder-stone-400 outline-none focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-all"
              required
            />
          </div>

          {/* Design Preferences Tags */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Design Goals / Preferences
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                      isSelected
                        ? "bg-brand-700 text-white shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Interior Design Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <span className="text-base shrink-0">{style.icon}</span>
                    <span className="text-[10px] font-bold text-stone-700 truncate">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-[10px] font-semibold text-red-650">{error}</p>}

          {/* Generate Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center rounded-xl bg-brand-700 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-800 transition-colors gap-1.5 mt-2"
          >
            ✨ Generate Design Suggestions
          </button>
        </form>
      )}

      {/* ── LOADING STATE ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-stone-100 border-t-brand-700" />
            <span className="text-sm font-display font-semibold text-brand-700">AI</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-700 animate-pulse">Orchestrating Room Suggestion...</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Calculating furniture layouts and paint color swatches</p>
          </div>
        </div>
      )}

      {/* ── SUGGESTIONS DISPLAY ── */}
      {result && !loading && (
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
          {/* Concept Reasoning */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 shadow-inner">
            <p className="text-[10px] font-bold text-brand-700 uppercase tracking-wider mb-1">AI Concept Summary</p>
            <p className="text-xs text-stone-650 leading-relaxed italic">{result.explanation}</p>
          </div>

          {/* Preview Image */}
          {result.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-sm aspect-video bg-stone-100">
              <img
                src={result.imageUrl}
                alt="AI Mockup Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                Render Mockup
              </div>
            </div>
          )}

          {/* Materials & Colors */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Colors & Materials</p>
            <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 bg-white">
              <div className="flex gap-2">
                <div
                  title="Walls Color"
                  className="h-8 w-8 rounded-full border border-stone-200 shadow-xs"
                  style={{ backgroundColor: result.recommendations.colors.walls }}
                />
                <div
                  title="Flooring Color"
                  className="h-8 w-8 rounded-full border border-stone-200 shadow-xs relative overflow-hidden"
                  style={{ backgroundColor: result.recommendations.colors.floor }}
                >
                  <div className="absolute inset-0 opacity-15 bg-black"
                       style={{ backgroundImage: `repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 6px)` }}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-stone-500 leading-tight">
                  {result.recommendations.colors.description}
                </p>
              </div>
            </div>
          </div>

          {/* Furniture details */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Recommended Elements</p>
            <div className="flex flex-col gap-1.5">
              {result.recommendations.furniture.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-stone-150 p-2 bg-white">
                  <div
                    className="h-7 w-7 rounded-lg border border-stone-100 flex items-center justify-center text-sm shadow-xs"
                    style={{ backgroundColor: item.color || "#eceff1" }}
                  >
                    🛋️
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-stone-850 truncate">{item.itemId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</p>
                    <p className="text-[9px] text-stone-400 mt-0.5">Position: {item.position.x}%, {item.position.y}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scalable Image Prompt */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Cloud Image Prompt</span>
              <button
                onClick={handleCopyPrompt}
                className={`text-[9px] font-bold transition-all px-1.5 py-0.5 rounded ${
                  copiedPrompt ? "text-emerald-700 bg-emerald-50" : "text-brand-600 hover:text-brand-800"
                }`}
              >
                {copiedPrompt ? "Copied!" : "Copy Prompt"}
              </button>
            </div>
            <p className="text-[10px] text-stone-500 leading-normal line-clamp-2 select-all font-mono" title={result.imagePrompt}>
              {result.imagePrompt}
            </p>
          </div>

          {/* Application Options */}
          <div className="mt-2 border-t border-stone-100 pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-stone-200 p-3 bg-stone-50/50">
              <div>
                <p className="text-xs font-semibold text-stone-750">Replace Existing Layout</p>
                <p className="text-[9px] text-stone-400 mt-0.5">Clears the current room furniture before placing AI suggestions</p>
              </div>
              <button
                type="button"
                onClick={() => setReplaceExisting((r) => !r)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  replaceExisting ? "bg-brand-700" : "bg-stone-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    replaceExisting ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleApply}
                className="flex-1 rounded-xl bg-brand-700 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-800 transition-colors"
              >
                Apply AI Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
