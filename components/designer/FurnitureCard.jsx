/**
 * FurnitureCard — a single furniture item in the catalog panel.
 *
 * Displays the emoji icon, item name, category badge, and an Add/Added toggle.
 * Prepared with data attributes for future drag-and-drop (Step 6).
 *
 * @param {{ id, name, category, icon, color, width, height }} item
 * @param {boolean} isAdded  - true if this item already exists in the preview
 * @param {function} onAdd   - called when the user clicks "Add to Room"
 * @param {function} onRemove - called when the user clicks "Remove"
 */
export default function FurnitureCard({ item, isAdded, onAdd, onRemove }) {
  const { id, name, category, icon, color } = item;

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
        isAdded
          ? "border-brand-300 bg-brand-50"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
      }`}
      /* Step 6 drag-and-drop hooks */
      data-furniture-id={id}
      draggable={false} /* will be enabled in Step 6 */
    >
      {/* Icon tile */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-semibold leading-tight ${
            isAdded ? "text-brand-800" : "text-stone-800"
          }`}
        >
          {name}
        </p>
        <p className="mt-0.5 text-xs text-stone-400">{category}</p>
      </div>

      {/* Action button */}
      {isAdded ? (
        <button
          type="button"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${name} from room`}
          className="shrink-0 rounded-full border border-brand-200 bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          ✓ Added
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAdd(item)}
          aria-label={`Add ${name} to room`}
          className="shrink-0 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-600 transition-all duration-150 hover:border-brand-400 hover:bg-brand-700 hover:text-white"
        >
          + Add
        </button>
      )}
    </div>
  );
}
