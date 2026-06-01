import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-cream"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,115,85,0.12),transparent)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Curated home inspiration
          </div>

          <div className="space-y-5">
            <h1
              id="hero-heading"
              className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl"
            >
              Transform every room into a space you love
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-stone-600">
              Discover furniture, accents, and design ideas tailored to your
              style—from cozy bedrooms to statement living rooms.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#categories"
              className="inline-flex items-center justify-center rounded-full bg-brand-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-800"
            >
              Shop by room
            </Link>
            <Link
              href="#styles"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-8 py-3.5 text-sm font-semibold text-stone-800 transition-colors hover:border-brand-400 hover:text-brand-800"
            >
              Browse styles
            </Link>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-stone-200 pt-8 sm:gap-8">
            {[
              { value: "2k+", label: "Products" },
              { value: "50+", label: "Designers" },
              { value: "4.9", label: "Avg. rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-medium text-stone-900 sm:text-3xl">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs text-stone-500 sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 h-48 w-48 rounded-full bg-brand-200/40 blur-3xl" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-stone-300/40 sm:aspect-[5/6] lg:aspect-[4/5]">
            <Image
              src="/images/living-room.jpg"
              alt="Elegant living room with neutral sofa and natural light"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-4 -left-4 max-w-[200px] rounded-xl border border-stone-200/80 bg-white/95 p-4 shadow-lg backdrop-blur sm:-left-6 sm:max-w-[220px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Trending
            </p>
            <p className="mt-1 font-display text-lg font-medium text-stone-900">
              Scandinavian warmth
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Light woods & soft textiles for every season.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
