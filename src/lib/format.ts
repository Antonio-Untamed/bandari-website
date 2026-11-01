export const USD_TO_KES = 129;

const fmt = (value: number, currency: "KSh" | "$", fractionDigits = 0) =>
  `${currency === "$" ? "$" : "KSh "}${value.toLocaleString("en-KE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;

export function kes(value: number, fractionDigits = 0) {
  return fmt(Math.round(value * 100) / 100, "KSh", fractionDigits);
}

export function usd(value: number, fractionDigits = 0) {
  return fmt(value, "$", fractionDigits);
}

export function compactKes(value: number) {
  if (value >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `KSh ${(value / 1_000).toFixed(0)}K`;
  return kes(value);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "To be confirmed";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(value: string | null | undefined) {
  if (!value) return null;
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return null;
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function titleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
