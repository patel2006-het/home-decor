"use client";

import { useState } from "react";
import { useDesign } from "@/context/DesignContext";

/**
 * FurniturePreviewItem — renders a single furniture piece inside the room canvas.
 *
 * Implements smooth Pointer Event-based dragging for positioning items.
 *
 * @param {{ instanceId, id, name, icon, color, width, height, position }} instance
 * @param {function} onRemove - called with instanceId to remove from preview
 */
export default function FurniturePreviewItem({ instance, onRemove }) {
  const { instanceId, id, name, icon, color, width, height, position } = instance;
  const { updateFurniturePosition } = useDesign();
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    // Only allow primary button dragging
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const itemEl = e.currentTarget;
    const parentEl = itemEl.parentElement;
    if (!parentEl) return;

    setIsDragging(true);
    itemEl.setPointerCapture(e.pointerId);

    const parentRect = parentEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position?.x ?? 50;
    const startPosY = position?.y ?? 50;

    const handlePointerMove = (moveEv) => {
      const deltaX = moveEv.clientX - startX;
      const deltaY = moveEv.clientY - startY;

      // Convert pixel deltas to percentage coordinates relative to parent canvas
      const deltaPercentX = (deltaX / parentRect.width) * 100;
      const deltaPercentY = (deltaY / parentRect.height) * 100;

      let newX = startPosX + deltaPercentX;
      let newY = startPosY + deltaPercentY;

      // Constrain within the room canvas container boundary (5% to 95%)
      newX = Math.max(5, Math.min(95, newX));
      newY = Math.max(5, Math.min(95, newY));

      updateFurniturePosition(instanceId, newX, newY);
    };

    const handlePointerUp = (upEv) => {
      setIsDragging(false);
      try {
        itemEl.releasePointerCapture(upEv.pointerId);
      } catch (err) {
        // Safe fallback if capture is lost
      }
      itemEl.removeEventListener("pointermove", handlePointerMove);
      itemEl.removeEventListener("pointerup", handlePointerUp);
    };

    itemEl.addEventListener("pointermove", handlePointerMove);
    itemEl.addEventListener("pointerup", handlePointerUp);
  };

  // If a position exists, use absolute coordinates. Otherwise, use relative flow layout.
  // touchAction: "none" is critical to allow mobile swipe drag without scrolling the page.
  const styleProps = position
    ? {
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        width: `${Math.min(width, 100)}px`,
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }
    : {
        width: `${Math.min(width, 100)}px`,
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
      };

  return (
    <div
      className={`group flex flex-col items-center gap-1 ${
        position ? "pointer-events-auto" : "relative"
      }`}
      style={styleProps}
      onPointerDown={handlePointerDown}
      data-furniture-id={id}
      data-instance-id={instanceId}
      draggable={false}
      title="Drag to reposition this item"
    >
      {/* Remove button — visible on group hover */}
      <button
        type="button"
        onClick={() => onRemove(instanceId)}
        aria-label={`Remove ${name} from room`}
        className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <svg
          className="h-2.5 w-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Furniture icon tile */}
      <div
        className="flex items-center justify-center rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105"
        style={{
          width: `${Math.min(width, 96)}px`,
          height: `${Math.max(Math.min(height, 72), 40)}px`,
          backgroundColor: color,
        }}
        aria-hidden="true"
      >
        <span className="text-2xl drop-shadow-sm">{icon}</span>
      </div>

      {/* Label */}
      <span className="max-w-full truncate rounded-full bg-white/80 px-2 py-0.5 text-center text-xs font-medium text-stone-700 shadow-sm backdrop-blur-sm">
        {name}
      </span>
    </div>
  );
}
