import type { ReactNode } from "react";
import { StarIcon } from "./icons";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`h-3.5 w-3.5 ${index < rating ? "text-clay" : "text-ink/15"}`}
        />
      ))}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes("transit")
    ? "border-sky-200 bg-sky-50 text-sky-800"
    : normalized.includes("reserved") || normalized.includes("sold")
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-fern/25 bg-sage/60 text-forest";
  const label = normalized.includes("transit")
    ? "On the water"
    : normalized.includes("reserved")
      ? "Reserved"
      : normalized.includes("sold")
        ? "Sold"
        : "Available";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <span className={`eyebrow ${tone === "dark" ? "!text-cream/60" : ""}`}>{eyebrow}</span>
        <h2
          className={`display mt-3 text-[30px] sm:text-[38px] ${
            tone === "dark" ? "text-cream" : "text-forest"
          }`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`mt-3 text-[14px] leading-relaxed ${tone === "dark" ? "text-cream/70" : "text-ink/65"}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SpecRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-t border-line py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
