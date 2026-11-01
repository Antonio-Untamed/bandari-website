import Link from "next/link";
import type { Metadata } from "next";
import { TrackForm } from "@/components/track-form";
import { StatusBadge } from "@/components/ui";
import { ArrowRight, CheckIcon, ClockIcon, HeartIcon, PinIcon, ShipIcon } from "@/components/icons";
import { getShipmentByCode } from "@/lib/data";
import { daysUntil, formatDate, formatDateTime, kes, usd } from "@/lib/format";
import { SHIPPING_STAGES, LAST_STAGE, stageLabel, stageProgress } from "@/lib/shipping";
import { SITE, waCallbackMessage, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shipment record",
  description: "Live milestones for an imported vehicle bound for Kenya.",
};

type Params = Promise<{ code: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

const DOCUMENTS = [
  { label: "Proforma invoice", from: 0 },
  { label: "Inspection report & photos", from: 2 },
  { label: "Export certificate", from: 3 },
  { label: "Bill of lading", from: 3 },
  { label: "KRA duty assessment", from: 5 },
  { label: "NTSA logbook & plates", from: 6 },
];

export default async function ShipmentPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { code } = await params;
  const search = await searchParams;
  const shipment = await getShipmentByCode(decodeURIComponent(code));

  if (!shipment) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Code not recognised</span>
          <h1 className="display mt-3 text-[36px] text-forest sm:text-[44px]">
            We couldn&apos;t find that file
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/60">
            <span className="font-mono text-forest">{decodeURIComponent(code)}</span> is not linked to
            an import file. Check the code in your reservation email, or try our demo shipment below.
          </p>
          <div className="mt-6 text-left">
            <TrackForm />
          </div>
          <Link href="/track" className="btn-outline mt-6">
            Back to the tracking desk
          </Link>
        </div>
      </div>
    );
  }

  const { order, vehicle, events } = shipment;
  const isNew = search.new === "1";
  const progress = stageProgress(order.stage);
  const delivered = order.stage >= LAST_STAGE;
  const nextEvent = events.find((event) => !event.done);
  const etaDays = daysUntil(order.eta);
  const depositPaid = order.stage >= 1;
  const deposit = order.depositKes;
  const balance = Math.max(order.totalKes - deposit, 0);

  return (
    <div className="pb-4">
      {isNew ? (
        <div className="border-b border-fern/25 bg-sage">
          <div className="container-page flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-forest">
              <CheckIcon className="h-4 w-4" />
              Your import file is open. Save your tracking code — it is your key to this page.
            </p>
            <p className="font-mono text-[13px] font-bold tracking-wide text-forest">
              {order.trackingCode}
            </p>
          </div>
        </div>
      ) : null}

      <section className="bg-forest pb-10 pt-8 text-cream sm:pb-12">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-cream/50">
              <Link href="/track" className="hover:text-cream">Tracking desk</Link>
              <span>/</span>
              <span className="font-mono text-cream/80">{order.trackingCode}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-cream/80">
              <span className={`h-1.5 w-1.5 rounded-full ${delivered ? "bg-emerald-300" : "bg-clay"}`} />
              {delivered ? "Delivered" : "In progress"} · updated {formatDate(order.updatedAt)}
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h1 className="display text-[34px] text-cream sm:text-[44px]">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-2 text-[13px] text-cream/60">
                Order {order.reference} · {order.customerName} · delivery to {order.deliveryCity}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-cream/70">
                <span className="inline-flex items-center gap-1.5">
                  <ShipIcon className="h-4 w-4 text-cream/45" />
                  {order.vesselName ? `MV ${order.vesselName}` : "Vessel booking pending"}
                  {order.voyageNumber ? ` · ${order.voyageNumber}` : ""}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PinIcon className="h-4 w-4 text-cream/45" />
                  {vehicle.originPort}, {vehicle.originCountry} → {order.destinationPort}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-cream/15 bg-cream/[0.07] p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50">
                    {delivered ? "Delivered on" : "Estimated arrival"}
                  </p>
                  <p className="display mt-1 text-[24px]">
                    {formatDate(delivered ? (order.eta || order.updatedAt) : order.eta)}
                  </p>
                </div>
                <p className="text-right text-[11px] text-cream/55">
                  {delivered
                    ? "Handover complete"
                    : etaDays !== null && etaDays > 0
                      ? `${etaDays} days to go`
                      : "Arriving at port"}
                  <br />
                  Mombasa, Kenya
                </p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
                <div className="h-full rounded-full bg-clay" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-cream/50">
                {stageLabel(order.stage)} · {progress}% of the journey
              </p>
            </div>
          </div>

          <ol className="mt-8 grid grid-cols-4 gap-y-4 border-t border-cream/15 pt-5 sm:grid-cols-8">
            {SHIPPING_STAGES.map((stage, index) => {
              const complete = index < order.stage;
              const current = index === order.stage;
              return (
                <li key={stage.key} className="relative pr-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                        complete
                          ? "bg-cream text-forest"
                          : current
                            ? "bg-clay text-white"
                            : "border border-cream/25 text-cream/40"
                      }`}
                    >
                      {complete ? "✓" : index + 1}
                    </span>
                    <span
                      className={`hidden h-px flex-1 sm:block ${
                        index < order.stage ? "bg-cream/50" : "bg-cream/15"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-2 text-[10.5px] font-medium leading-tight ${
                      current ? "text-cream" : complete ? "text-cream/70" : "text-cream/35"
                    }`}
                  >
                    {stage.short}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="container-page grid gap-7 py-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-7">
          <section className="card overflow-hidden">
            <div className="flex flex-col gap-4 p-5 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-44"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-semibold text-forest">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink/50">
                      {vehicle.trim} · {vehicle.color} · {vehicle.mileageKm.toLocaleString()} km ·{" "}
                      {vehicle.fuel}
                    </p>
                  </div>
                  <StatusBadge status={vehicle.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="chip">FOB {usd(vehicle.priceUsd)}</span>
                  <span className="chip">{vehicle.inspectionGrade}</span>
                  <span className="chip">{vehicle.engineCc.toLocaleString()} cc</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[12px]">
                  <Link href={`/vehicles/${vehicle.slug}`} className="font-semibold text-moss hover:underline">
                    View listing →
                  </Link>
                  <Link href="/engagements#share" className="inline-flex items-center gap-1.5 font-semibold text-clay hover:underline">
                    <HeartIcon className="h-3.5 w-3.5" />
                    Share your engagement
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-forest">Shipment timeline</h2>
              <span className="chip">{events.filter((event) => event.done).length} of {events.length} done</span>
            </div>

            <ol className="mt-5">
              {events.map((event) => (
                <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                        event.done
                          ? "border-moss bg-moss text-cream"
                          : "border-line bg-white text-ink/30"
                      }`}
                    >
                      {event.done ? <CheckIcon className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <span
                      className={`mt-1 w-px flex-1 ${event.done ? "bg-moss/30" : "bg-line"} last:hidden`}
                    />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className={`text-[13.5px] font-semibold ${event.done ? "text-forest" : "text-ink/50"}`}>
                        {event.title}
                      </p>
                      <p className={`text-[11px] ${event.done ? "text-ink/55" : "text-ink/35"}`}>
                        {event.done ? formatDate(event.occurredAt) : `Expected ${formatDate(event.occurredAt)}`}
                      </p>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{event.description}</p>
                    {event.location ? (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-ink/40">
                        <PinIcon className="h-3 w-3" />
                        {event.location}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            {nextEvent ? (
              <div className="mt-2 rounded-xl border border-clay/25 bg-clay-soft/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
                  Next milestone
                </p>
                <p className="mt-1 text-[13.5px] font-semibold text-forest">{nextEvent.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink/60">{nextEvent.description}</p>
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-fern/25 bg-sage/50 p-4">
                <p className="text-[13px] font-semibold text-forest">
                  This vehicle has been delivered. Congratulations!
                </p>
                <p className="mt-1 text-[12.5px] text-ink/60">
                  We would love to hear how the process felt — post it to the engagement wall.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-forest">
              Shipment facts
            </h2>
            <dl className="mt-3 space-y-2.5 text-[12.5px]">
              {[
                ["Tracking code", order.trackingCode],
                ["Order reference", order.reference],
                ["Carrier / vessel", order.vesselName ? `MV ${order.vesselName}` : "Awaiting booking"],
                ["Voyage", order.voyageNumber || "—"],
                ["Bill of lading", order.billOfLading || "Issued at export"],
                ["Departure (ETD)", formatDate(order.etd)],
                ["Arrival (ETA)", formatDate(order.eta)],
                ["Destination", `${order.destinationPort}, Kenya`],
                ["Last update", formatDateTime(order.updatedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
                  <dt className="text-ink/45">{label}</dt>
                  <dd className="text-right font-medium text-ink/80">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-forest">
              Payments
            </h2>
            <div className="mt-3 space-y-2 text-[12.5px]">
              <div className="flex items-center justify-between">
                <span className="text-ink/45">Landed total</span>
                <span className="font-semibold text-ink/80">{kes(order.totalKes)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/45">Deposit (30%)</span>
                <span className={depositPaid ? "font-semibold text-fern" : "font-semibold text-clay"}>
                  {depositPaid ? "Paid" : "Due"} · {kes(deposit)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="text-ink/45">Balance on arrival</span>
                <span className="font-semibold text-ink/80">{kes(balance)}</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
              Pay via M-Pesa Paybill or bank transfer to Bandari Auto Imports Ltd. Receipts are attached
              to this file.
            </p>
          </section>

          <section className="card p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-forest">
              Documents
            </h2>
            <ul className="mt-3 space-y-2.5">
              {DOCUMENTS.map((document) => {
                const ready = order.stage >= document.from;
                return (
                  <li key={document.label} className="flex items-start gap-2 text-[12.5px]">
                    <span
                      className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                        ready ? "bg-sage text-forest" : "bg-sand text-ink/30"
                      }`}
                    >
                      {ready ? <CheckIcon className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
                    </span>
                    <span className={ready ? "text-ink/75" : "text-ink/40"}>{document.label}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-sand/70 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              Your import advisor
            </p>
            <p className="mt-2 text-[14px] font-semibold text-forest">Amina Hassan</p>
            <p className="text-[12px] text-ink/55">Client desk · Mombasa &amp; Nairobi</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href={`tel:${SITE.phoneTel}`} className="btn-primary !py-2.5 text-[12.5px]">
                Call {SITE.phoneDisplay}
              </a>
              <a
                href={waLink(
                  waCallbackMessage({
                    name: order.customerName,
                    message: `Tracking ${order.trackingCode} — I would like an update on my shipment.`,
                    vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                  }),
                )}
                target="_blank"
                rel="noreferrer"
                className="btn !bg-[#25D366] !py-2.5 text-[12.5px] !text-white hover:!bg-[#1fb757]"
              >
                WhatsApp the desk
              </a>
              <a
                href={`mailto:${SITE.email}?subject=Shipment%20${order.trackingCode}`}
                className="btn-outline !py-2.5 text-[12.5px]"
              >
                Email the desk
              </a>
            </div>
            <Link
              href="/engagements#share"
              className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-clay hover:underline"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              Share your engagement
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
