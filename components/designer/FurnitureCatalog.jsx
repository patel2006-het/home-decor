import FurnitureCard from "@/components/designer/FurnitureCard";
import { furnitureCatalog } from "@/lib/data";

/**
 * FurnitureCatalog — furniture listing panel, filtered by the selected room.
 *
 * Renders the room-specific furniture items from furnitureCatalog.
 * Tells the parent (DesignerClient) when an item is added or removed.
 *
 * @param {string}   roomSlug       - The slug of the selected room
 * @param {Array}    placedItems    - Array of currently placed furniture instances
 * @param {function} onAdd          - Called with the furniture item object to add
 * @param {function} onRemove       - Called with the furniture item id to remove
 */
export default function FurnitureCatalog({
  roomSlug,
  placedItems = [],
  onAdd,
  onRemove,
}) {
  const items = furnitureCatalog[roomSlug] ?? [];

  // Build a Set of item IDs that are currently placed (for O(1) isAdded check)
  const placedIds = new Set(placedItems.map((p) => p.id));

  // Group items by category for cleaner visual organisation
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  if (items.length === 0) {
    return (
      <div className="px-5 py-6 text-center">
        <p className="text-sm text-stone-400">
          No furniture available for this room yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* Summary pill */}
      {placedItems.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2">
          <span className="text-xs font-semibold text-brand-700">
            {placedItems.length} item{placedItems.length !== 1 ? "s" : ""} added
            to room
          </span>
        </div>
      )}

      {/* Items grouped by category */}
      {categories.map((category) => (
        <div key={category}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
            {category}
          </p>
          <div className="flex flex-col gap-2">
            {grouped[category].map((item) => (
              <FurnitureCard
                key={item.id}
                item={item}
                isAdded={placedIds.has(item.id)}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
