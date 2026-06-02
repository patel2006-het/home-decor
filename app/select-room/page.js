import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import RoomCard from "@/components/RoomCard";
import { roomSelectionData } from "@/lib/data";

export const metadata = {
  title: "Select a Room | HavenDecor",
  description:
    "Choose a room to start designing. Browse bedroom, living room, kitchen, bathroom, dining room, and office collections on HavenDecor.",
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Select Room" },
];

export default function SelectRoomPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── Page hero ── */}
        <section
          className="relative overflow-hidden bg-cream py-16 sm:py-20"
          aria-labelledby="select-room-heading"
        >
          {/* Subtle radial background glow */}
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(139,115,85,0.10),transparent)]"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Page heading */}
            <div className="mx-auto max-w-2xl text-center">
              {/* Eyebrow */}
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Step 1 of 2
              </span>

              <h1
                id="select-room-heading"
                className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-stone-900 sm:text-5xl"
              >
                Which room are you&nbsp;designing?
              </h1>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Pick a space to get started. We'll help you find the perfect
                style and pieces to match.
              </p>
            </div>
          </div>
        </section>

        {/* ── Room cards grid ── */}
        <section
          className="bg-white py-12 sm:py-16"
          aria-label="Room selection grid"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {roomSelectionData.map((room) => (
                <li key={room.slug}>
                  <RoomCard room={room} />
                </li>
              ))}
            </ul>

            {/* Helper text below grid */}
            <p className="mt-10 text-center text-sm text-stone-500">
              Not sure where to start?{" "}
              <a
                href="/#categories"
                className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Explore all categories
              </a>{" "}
              on our home page.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
