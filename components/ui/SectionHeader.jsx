export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignClass =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center mx-auto";

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
