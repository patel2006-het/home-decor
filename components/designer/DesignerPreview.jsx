import FurniturePreviewItem from "@/components/designer/FurniturePreviewItem";

/**
 * DesignerPreview — The main room canvas area.
 *
 * Renders a 3D-perspective room preview using CSS — a back wall, left wall,
 * and floor plane — all updated instantly via inline style changes driven
 * by the selected wallColor and floorType from state.
 *
 * Furniture items placed by the user are rendered as FurniturePreviewItem tiles
 * along the bottom of the wall (above the floor line).
 *
 * @param {object}   props
 * @param {string}   props.wallColor          - hex string for the wall color
 * @param {string}   props.floorPattern       - CSS background value for the floor
 * @param {string}   props.roomName           - display name for the room
 * @param {string}   props.styleName          - display name for the style
 * @param {Array}    props.furnitureItems     - array of placed furniture instances
 * @param {function} props.onFurnitureRemove  - called with instanceId to remove an item
 */
export default function DesignerPreview({
  wallColor,
  floorPattern,
  roomName,
  styleName,
  furnitureItems = [],
  onFurnitureRemove,
}) {
  return (
    <div className="flex h-full flex-col">
      {/* ── Top bar ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
            Live Preview
          </p>
          <p className="mt-0.5 font-display text-base font-medium text-stone-900">
            {roomName} · {styleName}
          </p>
        </div>
        {/* Future: export / share button placeholder */}
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-400"
          title="Save design (coming soon)"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Save Design
        </button>
      </div>

      {/* ── Canvas ── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-stone-100 p-6 sm:p-10">

        {/* Perspective room box */}
        <div
          className="relative w-full max-w-2xl"
          style={{ perspective: "900px" }}
          role="img"
          aria-label={`Room preview: ${roomName} in ${styleName} style`}
        >
          {/* Room wrapper with 3D transform */}
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>

            {/* ── Back wall ── */}
            <div
              className="relative overflow-hidden rounded-t-2xl transition-colors duration-500"
              style={{
                backgroundColor: wallColor,
                height: "300px",
                boxShadow: `inset 0 -2px 20px rgba(0,0,0,0.08)`,
              }}
            >
              {/* Baseboard */}
              <div
                className="absolute inset-x-0 bottom-0 h-3 opacity-30"
                style={{ backgroundColor: "#7a6349" }}
                aria-hidden="true"
              />

              {/* Window on the wall */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                <div className="relative h-32 w-24 overflow-hidden rounded-t-full border-4 border-white/50 bg-sky-200/60 shadow-inner">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/50" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-white/50" />
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-300/40 to-sky-100/20" />
                </div>
              </div>

              {/* Wall ambient light effect */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.18) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* ── Furniture items — rendered against the wall ── */}
              {furnitureItems.length > 0 && (
                <div
                  className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-center gap-3"
                  aria-label="Placed furniture"
                >
                  {furnitureItems.map((instance) => (
                    <FurniturePreviewItem
                      key={instance.instanceId}
                      instance={instance}
                      onRemove={onFurnitureRemove}
                    />
                  ))}
                </div>
              )}

              {/* Empty state hint */}
              {furnitureItems.length === 0 && (
                <div className="absolute inset-x-0 bottom-8 flex items-center justify-center">
                  <p className="rounded-full bg-black/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                    Add furniture from the sidebar →
                  </p>
                </div>
              )}
            </div>

            {/* ── Left wall (perspective side panel) ── */}
            <div
              className="absolute left-0 top-0 h-full w-16 origin-left transition-colors duration-500"
              style={{
                backgroundColor: wallColor,
                filter: "brightness(0.82)",
                transform: "rotateY(90deg)",
                boxShadow: "inset -4px 0 12px rgba(0,0,0,0.12)",
              }}
              aria-hidden="true"
            />

            {/* ── Floor ── */}
            <div
              className="h-24 w-full rounded-b-2xl transition-all duration-500 sm:h-32"
              style={{
                backgroundImage: floorPattern,
                backgroundSize: "62px 100%",
                boxShadow: "inset 0 4px 16px rgba(0,0,0,0.10)",
                transform: "rotateX(30deg)",
                transformOrigin: "top",
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ── Info badge: current selections ── */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span
              className="h-3 w-3 rounded-full border border-stone-200 shadow-sm"
              style={{ backgroundColor: wallColor }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-stone-700">Wall</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-medium text-stone-700">Floor</span>
            <span
              className="h-3 w-10 rounded-sm border border-stone-200"
              style={{ backgroundImage: floorPattern, backgroundSize: "62px 100%" }}
              aria-hidden="true"
            />
          </div>
          {furnitureItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-xs font-medium text-brand-700">
                {furnitureItems.length} item{furnitureItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
