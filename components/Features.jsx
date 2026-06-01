import SectionHeader from "@/components/ui/SectionHeader";
import FeatureIcon from "@/components/ui/FeatureIcon";
import { features } from "@/lib/data";

export default function Features() {
  return (
    <section
      id="features"
      className="border-y border-stone-200 bg-stone-50 py-20 sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why HavenDecor"
          title="Everything you need to design with confidence"
          description="From discovery to delivery, we make it simple to create spaces that feel uniquely yours."
          className="mb-14"
        />

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col gap-4 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                <FeatureIcon name={feature.icon} />
              </span>
              <div>
                <h3 className="font-display text-lg font-medium text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
