import Image from "next/image";
import Link from "next/link";

/**
 * RoomCard — reusable card for the room selection page.
 *
 * @param {{ slug: string, name: string, description: string, image: string, accent: string }} room
 */
export default function RoomCard({ room }) {
  const { slug, name, description, image, accent } = room;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60">
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={`${name} interior design inspiration`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${accent} opacity-60 transition-opacity duration-300 group-hover:opacity-75`}
        />

        {/* Room name badge overlaid on image */}
        <div className="absolute bottom-4 left-4">
          <h3 className="font-display text-2xl font-medium text-white drop-shadow-sm">
            {name}
          </h3>
        </div>

        {/* Subtle top-right icon indicator */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/40">
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="flex-1 text-sm leading-relaxed text-stone-600">
          {description}
        </p>

        {/* Select Room CTA */}
        <Link
          href={`/select-style?room=${slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          aria-label={`Select ${name} — choose your style`}
        >
          Select Room
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
