import ColorSwatch from "@/components/designer/ColorSwatch";
import FloorOption from "@/components/designer/FloorOption";
import { wallColors, floorTypes } from "@/lib/data";
import Image from "next/image";

/**
 * DesignerSidebar — Left panel of the designer page.
 *
 * Displays: Room info, Style info, Wall Color picker, Floor Type picker.
 * Emits selection changes to the parent (DesignerClient) via callbacks.
 *
 * @param {object} props
 * @param {{ name: string, image: string, description: string }} props.room
 * @param {{ name: string, image: string }} props.style
 * @param {{ id: string, hex: string, label: string }} props.selectedColor
 * @param {{ id: string, label: string, pattern: string }} props.selectedFloor
 * @param {function} props.onColorChange
 * @param {function} props.onFloorChange
 */
export default function DesignerSidebar({
  room,
  style,
  selectedColor,
  selectedFloor,
  onColorChange,
  onFloorChange,
}) {
  return (
    <aside
      className="flex h-full flex-col gap-0 overflow-y-auto border-r border-stone-200 bg-white"
      aria-label="Design controls"
    >
      {/* ── Header ── */}
      <div className="border-b border-stone-100 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-600">
          Design Studio
        </p>
        <h2 className="mt-0.5 font-display text-lg font-medium text-stone-900">
          Customize Your Room
        </h2>
      </div>

      <div className="flex flex-col gap-px overflow-y-auto">
        {/* ── Room Info ── */}
        <section className="border-b border-stone-100 px-5 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
            Selected Room
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-stone-900">{room.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-stone-500">
                {room.description}
              </p>
            </div>
          </div>
          <a
            href="/select-room"
            className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 hover:underline"
          >
            ← Change room
          </a>
        </section>

        {/* ── Style Info ── */}
        <section className="border-b border-stone-100 px-5 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
            Selected Style
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={style.image}
                alt={style.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-stone-900">{style.name}</p>
              <p className="mt-0.5 text-xs text-stone-500">{style.description}</p>
            </div>
          </div>
          <a
            href="/select-style"
            className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 hover:underline"
          >
            ← Change style
          </a>
        </section>

        {/* ── Wall Color ── */}
        <section className="border-b border-stone-100 px-5 py-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
            Wall Color
          </h3>
          <p className="mb-3 text-sm font-medium text-stone-800">
            {selectedColor.label}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {wallColors.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color}
                isSelected={selectedColor.id === color.id}
                onSelect={onColorChange}
              />
            ))}
          </div>
        </section>

        {/* ── Floor Type ── */}
        <section className="px-5 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
            Floor Type
          </h3>
          <div className="flex flex-col gap-2">
            {floorTypes.map((floor) => (
              <FloorOption
                key={floor.id}
                floor={floor}
                isSelected={selectedFloor.id === floor.id}
                onSelect={onFloorChange}
              />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
