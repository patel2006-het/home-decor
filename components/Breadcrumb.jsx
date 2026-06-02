import Link from "next/link";

/**
 * Breadcrumb navigation component.
 *
 * @param {{ label: string, href?: string }[]} items - Breadcrumb trail.
 *   The last item is the current page (rendered as plain text, not a link).
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  className="text-sm font-medium text-brand-700"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href ?? "/"}
                    className="text-sm text-stone-500 transition-colors hover:text-stone-800"
                  >
                    {item.label}
                  </Link>
                  {/* Chevron separator */}
                  <svg
                    className="h-3.5 w-3.5 text-stone-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
