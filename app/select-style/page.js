import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import StyleCard from "@/components/StyleCard";
import { styleSelectionData, roomSelectionData } from "@/lib/data";

export const metadata = {
  title: "Choose Your Style | HavenDecor",
  description:
    "Select a design style — Modern, Minimalist, Scandinavian, Industrial, Bohemian, or Rustic — to personalize your room on HavenDecor.",
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Select Room", href: "/select-room" },
  { label: "Select Style" },
];

/**
 * Resolves a room display name from a slug.
 * Falls back gracefully if the slug is unknown or missing.
 */
function getRoomName(roomSlug) {
  if (!roomSlug) return null;
  const match = roomSelectionData.find((r) => r.slug === roomSlug);
  return match ? match.name : null;
}

/**
 * /select-style — Step 2 of the design flow.
 *
 * Reads the `room` query param forwarded from /select-room via RoomCard.
 * Passes it down to StyleCard so each CTA builds the correct URL:
 *   /designer?room=bedroom&style=modern
 */
export default function SelectStylePage({ searchParams }) {
  const roomSlug = searchParams?.room ?? null;
  const roomName = getRoomName(roomSlug);

  return (
    <>
      <Navbar />

      <main>
        {/* ── Page hero ── */}
        <section
          className="relative overflow-hidden bg-cream py-16 sm:py-20"
          aria-labelledby="select-style-heading"
        >
          {/* Radial glow — matches select-room page */}
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(139,115,85,0.10),transparent)]"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="mx-auto max-w-2xl text-center">
              {/* Step indicator */}
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Step 2 of 2
              </span>

              <h1
                id="select-style-heading"
                className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-stone-900 sm:text-5xl"
              >
                What&apos;s your design style?
              </h1>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Choose the aesthetic that speaks to you. We&apos;ll match it
                with the perfect pieces for your space.
              </p>

              {/* Room context pill — shown only when a valid room was selected */}
              {roomName && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2">
                  <svg
                    className="h-4 w-4 text-brand-600"
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
                  <span className="text-sm font-medium text-brand-700">
                    Designing for:{" "}
                    <strong className="font-semibold">{roomName}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Style cards grid ── */}
        <section
          className="bg-white py-12 sm:py-16"
          aria-label="Style selection grid"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {styleSelectionData.map((style) => (
                <li key={style.slug}>
                  <StyleCard style={style} roomSlug={roomSlug} />
                </li>
              ))}
            </ul>

            {/* Back / helper footer */}
            <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
              <a
                href="/select-room"
                className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                Change room
              </a>
              <span className="hidden text-stone-300 sm:block">|</span>
              <p className="text-sm text-stone-500">
                Not sure?{" "}
                <a
                  href="/#styles"
                  className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  Browse all styles
                </a>{" "}
                for inspiration.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
