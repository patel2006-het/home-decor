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
 * /designer — Design Studio page.
 *
 * Async server component — Next.js 16 App Router requires searchParams
 * to be awaited before its properties can be accessed.
 *
 * Resolves full room + style data objects from query params and passes them
 * to DesignerClient (the "use client" boundary that owns all interactive state).
 *
 * URL pattern: /designer?room=bedroom&style=modern
 */
export default async function DesignerPage({ searchParams }) {
  const params = await searchParams;

  const roomSlug  = params?.room  ?? "living-room";
  const styleSlug = params?.style ?? "modern";
  const projectId = params?.project ?? null;
  const shareData = params?.share ?? null;

  const room  = resolveRoom(roomSlug);
  const style = resolveStyle(styleSlug);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <DesignerClient 
        room={room} 
        style={style} 
        projectId={projectId} 
        shareData={shareData} 
      />
    </div>
  );
}
