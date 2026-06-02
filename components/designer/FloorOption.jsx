/**
 * FloorOption — a single floor type option button.
 *
 * @param {{ id: string, label: string, description: string, pattern: string }} floor
 * @param {boolean} isSelected
 * @param {function} onSelect
 */
export default function FloorOption({ floor, isSelected, onSelect }) {
  return (
    <button
      type="button"
      aria-label={`Select floor type: ${floor.label}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(floor)}
      className={`group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600 ${
        isSelected
          ? "border-brand-700 bg-brand-50 shadow-sm"
          : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {/* Floor texture preview swatch */}
      <span
        className="h-10 w-10 shrink-0 rounded-lg border border-stone-200"
        style={{ backgroundImage: floor.pattern }}
        aria-hidden="true"
      />

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold leading-tight ${
            isSelected ? "text-brand-800" : "text-stone-800"
          }`}
        >
          {floor.label}
        </span>
        <span className="block text-xs leading-snug text-stone-500">
          {floor.description}
        </span>
      </span>

      {/* Selected indicator dot */}
      <span
        className={`h-2 w-2 shrink-0 rounded-full transition-all duration-200 ${
          isSelected ? "bg-brand-700" : "bg-transparent"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
