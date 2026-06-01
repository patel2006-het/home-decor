import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { roomCategories } from "@/lib/data";

export default function RoomCategories() {
  return (
    <section
      id="categories"
      className="bg-white py-20 sm:py-24"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Shop by space"
          title="Popular room categories"
          description="Find inspiration and essentials curated for the way you live in each room."
          className="mb-14"
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roomCategories.map((room) => (
            <li key={room.name}>
              <a
                href="#"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={room.image}
                    alt={`${room.name} interior inspiration`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${room.accent} via-stone-900/20 to-stone-900/50`}
                  />
                  <h3 className="absolute bottom-4 left-4 font-display text-2xl font-medium text-white">
                    {room.name}
                  </h3>
                </div>
                <p className="flex flex-1 items-start p-5 text-sm leading-relaxed text-stone-600">
                  {room.description}
                  <span className="ml-1 inline font-medium text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
