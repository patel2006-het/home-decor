/**
 * FurniturePreviewItem — renders a single furniture piece inside the room canvas.
 *
 * Displays an emoji icon tile + label. The outer div carries data attributes
 * ready for drag-and-drop positioning in Step 6.
 *
 * @param {{ instanceId, id, name, icon, color, width, height }} instance
 * @param {function} onRemove - called with instanceId to remove from preview
 */
export default function FurniturePreviewItem({ instance, onRemove }) {
  const { instanceId, id, name, icon, color, width, height } = instance;

  return (
    <div
      className="group relative flex flex-col items-center gap-1"
      style={{ width: `${Math.min(width, 100)}px` }}
      /* Step 6 drag hooks */
      data-furniture-id={id}
      data-instance-id={instanceId}
      draggable={false} /* will be true in Step 6 */
      title={name}
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
