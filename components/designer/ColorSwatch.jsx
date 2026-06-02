/**
 * ColorSwatch — a single wall-color option button.
 *
 * @param {{ id: string, label: string, hex: string }} color
 * @param {boolean} isSelected
 * @param {function} onSelect
 */
export default function ColorSwatch({ color, isSelected, onSelect }) {
  return (
    <button
      type="button"
      title={color.label}
      aria-label={`Select wall color: ${color.label}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(color)}
      className={`relative h-8 w-8 rounded-full border-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
        isSelected
          ? "scale-110 border-brand-700 shadow-md"
          : "border-transparent hover:scale-105 hover:border-stone-400"
      }`}
      style={{ backgroundColor: color.hex }}
    >
      {/* Checkmark for selected state */}
      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-3.5 w-3.5 drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}
