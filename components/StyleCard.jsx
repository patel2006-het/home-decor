"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDesign } from "@/context/DesignContext";

/**
 * StyleCard — reusable card for the style selection page.
 *
 * @param {{ slug: string, name: string, description: string, image: string }} style
 * @param {string} roomSlug - The room slug from the query param, forwarded to /designer
 */
export default function StyleCard({ style, roomSlug }) {
  const { slug, name, description, image } = style;
  const router = useRouter();
  const { setSelectedStyle } = useDesign();

  const handleSelectStyle = (e) => {
    e.preventDefault();
    setSelectedStyle(style);
    router.push("/designer");
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60">
      {/* Image area — tall portrait ratio matches the DesignStyles section aesthetic */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={image}
          alt={`${name} interior design style`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dark gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent" />

        {/* Style name overlaid at bottom */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-2xl font-medium text-white drop-shadow-sm">
            {name}
          </h3>
          {/* Animated underline on hover */}
          <span
            className="mt-1 block h-0.5 w-0 rounded-full bg-brand-400 transition-all duration-500 group-hover:w-10"
            aria-hidden="true"
          />
        </div>

        {/* Top-right badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/30">
          <span className="text-xs font-semibold tracking-wide text-white">
            {name}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="flex-1 text-sm leading-relaxed text-stone-600">
          {description}
        </p>

        {/* Choose Style CTA */}
        <Link
          href="/designer"
          onClick={handleSelectStyle}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          aria-label={`Choose ${name} style for your room`}
        >
          Choose Style
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
