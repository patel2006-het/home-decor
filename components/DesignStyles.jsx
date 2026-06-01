import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { designStyles } from "@/lib/data";

export default function DesignStyles() {
  return (
    <section
      id="styles"
      className="bg-cream py-20 sm:py-24"
      aria-labelledby="styles-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Find your aesthetic"
          title="Design styles showcase"
          description="Explore signature looks and mix elements to build a home that tells your story."
          className="mb-14"
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designStyles.map((style, index) => (
            <li
              key={style.name}
              className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <a
                href="#"
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl sm:aspect-[4/5]"
              >
                <Image
                  src={style.image}
                  alt={`${style.name} interior design style`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl font-medium text-white">
                    {style.name}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-200 opacity-90 transition-opacity group-hover:opacity-100">
                    {style.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors group-hover:text-white">
                    View lookbook
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
