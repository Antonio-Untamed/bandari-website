"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarIcon } from "./icons";

export function EngagementComposer({ vehicles }: { vehicles: string[] }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    authorName: "",
    city: "",
    vehicleName: vehicles[0] ?? "",
    title: "",
    body: "",
    trackingCode: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not publish your story.");
      setDone(true);
      setForm({ authorName: "", city: "", vehicleName: vehicles[0] ?? "", title: "", body: "", trackingCode: "" });
      setRating(5);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card p-6 sm:p-7" id="share">
      <span className="eyebrow">Client engagement</span>
      <h2 className="display mt-2 text-[26px] text-forest">Share your import story</h2>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
        Tell other Kenyan buyers how the process went — from the first quote to collecting your keys.
        Reviews are published instantly to the wall.
      </p>

      {done ? (
        <div className="mt-5 rounded-xl border border-fern/30 bg-sage/50 px-4 py-3 text-[13px] font-medium text-forest">
          Asante sana! Your engagement is live on the wall below.
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="engagement-name">Your name</label>
            <input
              id="engagement-name"
              required
              value={form.authorName}
              onChange={(event) => update("authorName", event.target.value)}
              className="field"
              placeholder="e.g. Grace Njoroge"
            />
          </div>
          <div>
            <label className="label" htmlFor="engagement-city">Town / city</label>
            <input
              id="engagement-city"
              required
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
              className="field"
              placeholder="e.g. Thika"
            />
          </div>
          <div>
            <label className="label" htmlFor="engagement-vehicle">Vehicle imported</label>
            <input
              id="engagement-vehicle"
              list="engagement-vehicles"
              value={form.vehicleName}
              onChange={(event) => update("vehicleName", event.target.value)}
              className="field"
              placeholder="Toyota Premio F-EX"
            />
            <datalist id="engagement-vehicles">
              {vehicles.map((vehicle) => (
                <option key={vehicle} value={vehicle} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="label" htmlFor="engagement-code">Tracking code (optional)</label>
            <input
              id="engagement-code"
              value={form.trackingCode}
              onChange={(event) => update("trackingCode", event.target.value)}
              className="field font-mono text-[12px] uppercase"
              placeholder="BND-1234-AB"
            />
          </div>
        </div>

        <div>
          <span className="label">Your rating</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                className="rounded-md p-0.5 transition hover:scale-110"
              >
                <StarIcon className={`h-6 w-6 ${value <= rating ? "text-clay" : "text-ink/15"}`} />
              </button>
            ))}
            <span className="ml-2 text-[12px] text-ink/50">{rating}.0 / 5</span>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="engagement-title">Headline</label>
          <input
            id="engagement-title"
            required
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            className="field"
            placeholder="e.g. Landed in seven weeks, no surprises"
          />
        </div>

        <div>
          <label className="label" htmlFor="engagement-body">Your experience</label>
          <textarea
            id="engagement-body"
            required
            rows={5}
            maxLength={900}
            value={form.body}
            onChange={(event) => update("body", event.target.value)}
            className="field resize-none"
            placeholder="What worked, what you'd tell a first-time importer, how the tracking updates felt…"
          />
          <p className="mt-1 text-right text-[11px] text-ink/40">{form.body.length}/900</p>
        </div>

        {error ? (
          <p className="rounded-xl border border-clay/30 bg-clay-soft px-4 py-3 text-[13px] font-medium text-clay">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
          {pending ? "Publishing…" : "Publish engagement"}
        </button>
      </form>
    </div>
  );
}
