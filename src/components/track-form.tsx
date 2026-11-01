"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, SearchIcon } from "./icons";

export function TrackForm({
  tone = "light",
  demoCode = "BND-4820-KE",
}: {
  tone?: "light" | "dark";
  demoCode?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const dark = tone === "dark";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = code.trim();
    if (value.length < 4) {
      setError("Enter your tracking code (e.g. BND-4820-KE) or order reference.");
      return;
    }
    setError("");
    setPending(true);
    router.push(`/track/${encodeURIComponent(value.toUpperCase())}`);
  }

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon
            className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
              dark ? "text-cream/50" : "text-ink/40"
            }`}
          />
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Tracking code or reference"
            aria-label="Tracking code or order reference"
            className={`w-full rounded-full border py-3 pl-10 pr-4 text-sm outline-none transition ${
              dark
                ? "border-cream/25 bg-cream/10 text-cream placeholder:text-cream/45 focus:border-cream/60"
                : "border-line bg-white text-ink placeholder:text-ink/35 focus:border-moss focus:ring-2 focus:ring-moss/15"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`btn shrink-0 ${dark ? "bg-cream text-forest hover:bg-white" : "btn-primary"}`}
        >
          {pending ? "Opening…" : "Track shipment"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <div className={`mt-2.5 flex flex-wrap items-center gap-2 text-[11.5px] ${dark ? "text-cream/55" : "text-ink/50"}`}>
        <span>Demo shipment:</span>
        <button
          type="button"
          onClick={() => {
            setCode(demoCode);
            setError("");
          }}
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition ${
            dark
              ? "border-cream/25 text-cream/80 hover:border-cream/60"
              : "border-line bg-white/70 text-forest hover:border-moss"
          }`}
        >
          {demoCode}
        </button>
        <span>· shown on the track page too</span>
      </div>
      {error ? (
        <p className={`mt-2 text-[12px] font-medium ${dark ? "text-amber-200" : "text-clay"}`}>{error}</p>
      ) : null}
    </div>
  );
}
