import Navbar from "@/components/Navbar";
import DesignerClient from "@/app/designer/DesignerClient";
import { roomSelectionData, styleSelectionData } from "@/lib/data";

export const metadata = {
  title: "Design Studio | HavenDecor",
  description:
    "Customize your room — choose wall colors, floor types, and design your perfect space with the HavenDecor Design Studio.",
};

/**
 * Resolves full room data object from slug, with safe fallback.
 */
function resolveRoom(slug) {
  return (
    roomSelectionData.find((r) => r.slug === slug) ?? {
      slug: "living-room",
      name: "Living Room",
      description: "Gathering spaces that balance comfort, statement pieces, and everyday warmth.",
      image: "/images/living-room.jpg",
      accent: "from-stone-900/60 to-amber-900/70",
    }
  );
}

/**
 * Resolves full style data object from slug, with safe fallback.
 */
function resolveStyle(slug) {
  return (
    styleSelectionData.find((s) => s.slug === slug) ?? {
      slug: "modern",
      name: "Modern",
      description: "Sharp lines, bold geometric forms, and a refined palette. Modern interiors feel curated and effortlessly sophisticated.",
      image: "/images/styles/modern.jpg",
    }
  );
}

/**
 * /designer — Step 4: Design Studio page.
 *
 * Server component — reads ?room= and ?style= from the URL query string
 * (passed forward from /select-style via StyleCard's href).
 *
 * Resolves full data objects and passes them to DesignerClient
 * (the "use client" boundary that owns all interactive state).
 *
 * URL pattern: /designer?room=bedroom&style=modern
 */
export default function DesignerPage({ searchParams }) {
  const roomSlug  = searchParams?.room  ?? "living-room";
  const styleSlug = searchParams?.style ?? "modern";

  const room  = resolveRoom(roomSlug);
  const style = resolveStyle(styleSlug);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <DesignerClient room={room} style={style} />
    </div>
  );
}
