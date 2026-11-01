"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { kes } from "@/lib/format";
import { ArrowRight, ShieldIcon } from "./icons";

const CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Nyeri",
  "Machakos",
  "Kitale",
  "Malindi",
];

export function ReserveForm({
  slug,
  vehicleLabel,
  totalKes,
  depositKes,
  etaWeeks,
}: {
  slug: string;
  vehicleLabel: string;
  totalKes: number;
  depositKes: number;
  etaWeeks: number;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState("deposit");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryCity: "Nairobi",
    notes: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, vehicleSlug: slug, paymentPlan: plan }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        trackingCode?: string;
        error?: string;
      };
      if (!response.ok || !data.ok || !data.trackingCode) {
        throw new Error(data.error ?? "We could not open that order. Please try again.");
      }
      router.push(`/track/${encodeURIComponent(data.trackingCode)}?new=1`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={submit} className="card p-6 sm:p-7">
        <h2 className="display text-[24px] text-forest">Reservation details</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          No payment is taken online. This opens your import file and holds the unit for 72 hours while
          an advisor confirms the proforma invoice.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reserve-name">Full name</label>
            <input
              id="reserve-name"
              required
              value={form.customerName}
              onChange={(event) => update("customerName", event.target.value)}
              className="field"
              placeholder="e.g. Wanjiru Kamau"
            />
          </div>
          <div>
            <label className="label" htmlFor="reserve-email">Email</label>
            <input
              id="reserve-email"
              type="email"
              required
              value={form.customerEmail}
              onChange={(event) => update("customerEmail", event.target.value)}
              className="field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="reserve-phone">Phone / WhatsApp</label>
            <input
              id="reserve-phone"
              required
              value={form.customerPhone}
              onChange={(event) => update("customerPhone", event.target.value)}
              className="field"
              placeholder="+254 7xx xxx xxx"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reserve-city">Delivery town</label>
            <select
              id="reserve-city"
              value={form.deliveryCity}
              onChange={(event) => update("deliveryCity", event.target.value)}
              className="field"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <span className="label">Payment plan</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { id: "deposit", title: "30% deposit", detail: `${kes(depositKes)} now` },
                { id: "full", title: "Full settlement", detail: `${kes(totalKes)} on invoice` },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`cursor-pointer rounded-xl border p-3.5 transition ${
                    plan === option.id
                      ? "border-moss bg-sage/40 ring-1 ring-moss/30"
                      : "border-line bg-white hover:border-moss/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={option.id}
                    checked={plan === option.id}
                    onChange={() => setPlan(option.id)}
                    className="sr-only"
                  />
                  <span className="block text-[13px] font-semibold text-forest">{option.title}</span>
                  <span className="mt-0.5 block text-[11.5px] text-ink/55">{option.detail}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reserve-notes">Requests for our sourcing team</label>
            <textarea
              id="reserve-notes"
              rows={3}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="field resize-none"
              placeholder="Accessories, colour preference, pickup timing, trade-in…"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-clay/30 bg-clay-soft px-4 py-3 text-[13px] font-medium text-clay">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="btn-clay mt-6 w-full">
          {pending ? "Opening your import file…" : "Reserve this vehicle"}
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-ink/45">
          <ShieldIcon className="h-3.5 w-3.5" />
          No card required. You approve the invoice before any payment.
        </p>
      </form>

      <aside className="h-fit rounded-2xl border border-line bg-forest p-6 text-cream lg:sticky lg:top-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">
          Your order summary
        </p>
        <h3 className="display mt-2 text-[22px] leading-tight">{vehicleLabel}</h3>
        <dl className="mt-5 space-y-3 border-t border-cream/15 pt-4 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cream/60">Estimated landed total</dt>
            <dd className="font-semibold">{kes(totalKes)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cream/60">Deposit (30%)</dt>
            <dd className="font-semibold">{kes(depositKes)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cream/60">Balance on arrival</dt>
            <dd className="font-semibold">{kes(totalKes - depositKes)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cream/60">Estimated transit</dt>
            <dd className="font-semibold">{etaWeeks} weeks</dd>
          </div>
        </dl>
        <div className="mt-5 rounded-xl bg-cream/10 p-4 text-[12px] leading-relaxed text-cream/75">
          Reserved today · inspection photos uploaded within 5 working days · tracking code issued
          immediately after you submit.
        </div>
      </aside>
    </div>
  );
}
