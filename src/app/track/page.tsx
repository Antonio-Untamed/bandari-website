import Link from "next/link";
import type { Metadata } from "next";
import { TrackForm } from "@/components/track-form";
import { StatusBadge } from "@/components/ui";
import { ArrowUpRight, CheckIcon, ClockIcon, ShieldIcon, ShipIcon } from "@/components/icons";
import { getRecentShipments } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { SHIPPING_STAGES, stageLabel, stageProgress } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track your shipment",
  description:
    "Follow your imported vehicle from the origin port to Mombasa and final delivery in Kenya.",
};

export default async function TrackPage() {
  const shipments = await getRecentShipments(4);

  return (
    <>
      <section className="border-b border-line bg-sand/50 py-14 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="eyebrow">
              <ShipIcon className="h-4 w-4" />
              Tracking desk
            </span>
            <h1 className="display mt-4 text-[38px] text-forest sm:text-[50px]">
              Where is my car?
            </h1>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink/65">
              Enter your Bandari tracking code or order reference. You will see the vessel, customs
              stage, payment position and exactly what happens next — no phone call needed.
            </p>
            <div className="mt-6 max-w-xl">
              <TrackForm />
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-[12px]">
              <span className="chip">
                <ShieldIcon className="h-3.5 w-3.5" />
                Codes are private to your file
              </span>
              <Link href="/engagements" className="chip hover:border-moss">
                Share your engagement
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                The eight milestones
              </p>
              <span className="chip">Mombasa · Kenya</span>
            </div>
            <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {SHIPPING_STAGES.map((stage, index) => (
                <li key={stage.key} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sand text-[10px] font-semibold text-forest">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold leading-tight text-forest">{stage.label}</p>
                    <p className="text-[11px] leading-snug text-ink/45">{stage.blurb}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Live movements</span>
            <h2 className="display mt-2 text-[28px] text-forest sm:text-[34px]">
              Recently updated files
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-[11.5px] leading-relaxed text-ink/45 sm:block">
            Anonymised shipment records. Clients see the full record for their own code.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {shipments.map(({ order, vehicle }) => {
            const progress = stageProgress(order.stage);
            return (
              <Link
                key={order.id}
                href={`/track/${order.trackingCode}`}
                className="group card flex gap-4 overflow-hidden p-4 transition hover:border-moss/50 hover:shadow-[0_20px_40px_-30px_rgba(16,36,29,0.5)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-24 w-28 shrink-0 rounded-xl object-cover sm:h-28 sm:w-36"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-[12px] font-semibold text-forest">{order.trackingCode}</p>
                    <StatusBadge status={order.stage >= 7 ? "delivered" : "in_transit"} />
                  </div>
                  <p className="mt-1 truncate text-[13px] font-semibold text-ink/80">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink/50">
                    {stageLabel(order.stage)} · {order.customerName.split(" ")[0]}{" "}
                    {order.customerName.split(" ")[1]?.slice(0, 1)}.
                  </p>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                    <div className="h-full rounded-full bg-moss" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink/50">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {order.stage >= 7 ? "Delivered" : `ETA ${formatDate(order.eta)}`}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-moss opacity-0 transition group-hover:opacity-100">
                      Open <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Photos at the yard",
              body: "Exterior, interior, odometer and underbody shots uploaded before loading.",
            },
            {
              title: "Vessel & bill of lading",
              body: "Carrier, voyage and BL number visible as soon as export documents are cut.",
            },
            {
              title: "Duty & delivery",
              body: "KRA assessment, clearing progress, NTSA plates and your handover date.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-5">
              <CheckIcon className="h-5 w-5 text-fern" />
              <h3 className="mt-3 text-[14px] font-semibold text-forest">{item.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
