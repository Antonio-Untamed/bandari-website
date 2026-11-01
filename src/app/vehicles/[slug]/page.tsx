import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VehicleGallery } from "@/components/gallery";
import { CostCalculator, type CalculatorOption } from "@/components/cost-calculator";
import { VehicleCard } from "@/components/vehicle-card";
import { SpecRow } from "@/components/ui";
import { ArrowRight, CheckIcon, ClockIcon, PinIcon, ShieldIcon, ShipIcon } from "@/components/icons";
import { getRelatedVehicles, getVehicleBySlug } from "@/lib/data";
import { costInputFromVehicle, estimateLandedCost } from "@/lib/pricing";
import { formatDate, kes, usd } from "@/lib/format";
import { SHIPPING_STAGES, addDays, isoDate } from "@/lib/shipping";
import { KRA_SCHEDULE } from "@/lib/crsp";
import { SITE, waCallbackMessage, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site-chrome";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };
  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    description: `${vehicle.year} ${vehicle.make} ${vehicle.model} from ${vehicle.originPort}, ${vehicle.originCountry}. ${vehicle.mileageKm.toLocaleString()}km, ${vehicle.fuel}, landed cost to Kenya included.`,
  };
}

const DOCUMENTS = [
  "Export certificate / deregistration",
  "Auction sheet or dealer invoice",
  "Pre-shipment inspection (JEVIC / QISJ)",
  "Bill of lading & arrival notice",
  "KRA duty assessment receipt",
  "NTSA logbook in your name",
];

export default async function VehicleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const related = await getRelatedVehicles(vehicle);
  const cost = estimateLandedCost(costInputFromVehicle(vehicle));
  const calculatorOption: CalculatorOption = {
    id: String(vehicle.id),
    label: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    input: costInputFromVehicle(vehicle),
    href: `/vehicles/${vehicle.slug}/order`,
    priceUsd: vehicle.priceUsd,
  };
  const origin = `${vehicle.originPort}, ${vehicle.originCountry}`;
  const arrival = addDays(vehicle.etaWeeks * 7);

  return (
    <div className="container-page py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-2 text-[12px] text-ink/45">
        <Link href="/" className="hover:text-forest">Home</Link>
        <span>/</span>
        <Link href="/vehicles" className="hover:text-forest">Inventory</Link>
        <span>/</span>
        <span className="text-ink/70">{vehicle.make} {vehicle.model}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <VehicleGallery
            images={vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.imageUrl]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            badge={`${vehicle.condition} · ${vehicle.inspectionGrade}`}
          />

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="display text-[32px] text-forest sm:text-[38px]">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="mt-1.5 text-[13px] text-ink/55">
                  {vehicle.trim || vehicle.bodyType} · {vehicle.color} · stock #{vehicle.id.toString().padStart(4, "0")}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11.5px] font-medium text-ink/65">
                <PinIcon className="h-3.5 w-3.5" />
                {origin}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 rounded-2xl border border-line bg-white px-5 py-2 sm:grid-cols-3">
              <SpecRow label="Year" value={vehicle.year} />
              <SpecRow label="Mileage" value={`${vehicle.mileageKm.toLocaleString()} km`} />
              <SpecRow label="Engine" value={`${vehicle.engineCc.toLocaleString()} cc`} />
              <SpecRow label="Fuel" value={vehicle.fuel} />
              <SpecRow label="Transmission" value={vehicle.transmission} />
              <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
              <SpecRow label="Body" value={vehicle.bodyType} />
              <SpecRow label="Condition" value={vehicle.condition} />
              <SpecRow label="Inspection" value={vehicle.inspectionGrade} />
            </dl>
          </div>

          <section className="mt-8">
            <h2 className="text-[16px] font-semibold text-forest">Features &amp; equipment</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {vehicle.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[12.5px] text-ink/65">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fern" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-6" id="kra-duty">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-moss" />
                <h2 className="text-[16px] font-semibold text-forest">KRA duty on this unit</h2>
              </div>
              <span className="chip">{KRA_SCHEDULE.version}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
              Kenya Revenue Authority values used imports from the CRSP schedule, depreciates it by age
              and taxes the resulting customs value. Here is the arithmetic for this unit.
            </p>
            <dl className="mt-4 divide-y divide-line text-[12.5px]">
              {[
                ["CRSP (new retail value)", kes(cost.kra.crspKes)],
                [`Depreciation — ${cost.kra.depreciationLabel}`, `− ${Math.round(cost.kra.depreciationPct * 100)}%`],
                ["Depreciated CRSP", kes(cost.kra.depreciatedCrspKes)],
                ["Declared CIF value", kes(cost.kra.declaredCifKes)],
                [`Valuation used by KRA`, cost.kra.valuationBasis === "crsp" ? "Depreciated CRSP" : "Declared CIF"],
                [`Import duty (${Math.round(cost.kra.importDutyRate * 100)}%)`, kes(cost.kra.importDutyKes)],
                [`Excise duty (${Math.round(cost.kra.exciseRate * 100)}%)`, kes(cost.kra.exciseKes)],
                ["IDF (3.5%)", kes(cost.kra.idfKes)],
                ["RDL (2%)", kes(cost.kra.rdlKes)],
                ["VAT (16%)", kes(cost.kra.vatKes)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-ink/55">{label}</dt>
                  <dd className="font-medium tabular-nums text-ink/85">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
                  Total KRA taxes
                </dt>
                <dd className="text-[14px] font-bold tabular-nums text-forest">{kes(cost.kra.totalTaxesKes)}</dd>
              </div>
            </dl>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand/60 px-3.5 py-3 text-[11.5px] text-ink/55">
              <span>
                Excise band: {cost.kra.exciseBand}. Customs value is {Math.round(cost.kra.effectiveRate * 100)}%
                taxed in total.
              </span>
              <a
                href={waLink(
                  waCallbackMessage({
                    name: "Website visitor",
                    message: `Please confirm the KRA duty on the ${vehicle.year} ${vehicle.make} ${vehicle.model} (CRSP ${kes(cost.kra.crspKes)}).`,
                    vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                  }),
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1fb757]"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Ask about duty
              </a>
            </div>
            <p className="mt-2 text-[11px] text-ink/40">
              Indicative estimate. The final figure is on the KRA assessment raised at Mombasa and is
              shared on your tracking page. Desk: {SITE.phoneDisplay}.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-moss" />
              <h2 className="text-[16px] font-semibold text-forest">Inspection &amp; documents</h2>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
              This unit is {vehicle.condition.toLowerCase() === "new" ? "new" : "used"} and inspected
              before loading. We verify mileage against the auction sheet, photograph the underbody and
              upload everything to your import file before the carrier sails.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {DOCUMENTS.map((document) => (
                <li key={document} className="flex items-start gap-2 text-[12.5px] text-ink/65">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fern" />
                  {document}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-[16px] font-semibold text-forest">How it reaches you</h2>
            <ol className="mt-4 space-y-4 border-l border-line pl-5">
              {SHIPPING_STAGES.slice(0, 7).map((stage, index) => (
                <li key={stage.key} className="relative">
                  <span className="absolute -left-[27px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-moss bg-cream" />
                  <p className="text-[13px] font-semibold text-forest">{stage.label}</p>
                  <p className="text-[12px] leading-snug text-ink/55">{stage.blurb}</p>
                  {index === 4 ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-moss">
                      <ShipIcon className="h-3.5 w-3.5" />
                      Estimated Mombasa arrival {formatDate(isoDate(arrival))}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-sand/50 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                    Vehicle price (FOB)
                  </p>
                  <p className="display mt-1 text-[30px] text-forest">{usd(vehicle.priceUsd)}</p>
                </div>
                <span className="text-right text-[11px] text-ink/50">
                  ≈ {kes(vehicle.priceUsd * cost.rate)}
                  <br />
                  before duty
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="rounded-xl bg-forest p-4 text-cream">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/55">
                  Estimated landed total
                </p>
                <p className="display mt-1 text-[28px]">{kes(cost.totalKes)}</p>
                <div className="mt-3 flex items-center justify-between border-t border-cream/15 pt-3 text-[12px]">
                  <span className="text-cream/60">30% deposit</span>
                  <span className="font-semibold">{kes(cost.depositKes)}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[12px]">
                  <span className="text-cream/60">Balance on arrival</span>
                  <span className="font-semibold">{kes(cost.balanceKes)}</span>
                </div>
              </div>

              <Link href={`/vehicles/${vehicle.slug}/order`} className="btn-clay mt-4 w-full">
                Reserve this vehicle
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(
                  waCallbackMessage({
                    name: "Website visitor",
                    message: "I am interested in this unit. Please send me the full landed cost and photos.",
                    vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                  }),
                )}
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 w-full !bg-[#25D366] !py-2.5 text-[13px] !text-white hover:!bg-[#1fb757]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp · {SITE.phoneDisplay}
              </a>
              <Link href="/track" className="btn-outline mt-2 w-full !py-2.5 text-[13px]">
                Have an order? Track it
              </Link>

              <ul className="mt-4 space-y-2 text-[12px] text-ink/60">
                <li className="flex items-center gap-2">
                  <ClockIcon className="h-3.5 w-3.5 text-moss" />
                  Estimated {vehicle.etaWeeks} weeks door to door
                </li>
                <li className="flex items-center gap-2">
                  <ShipIcon className="h-3.5 w-3.5 text-moss" />
                  Sailing from {origin}
                </li>
                <li className="flex items-center gap-2">
                  <ShieldIcon className="h-3.5 w-3.5 text-moss" />
                  Marine insurance included
                </li>
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-ink/45">
                No payment is taken on this site. Reserving opens your import file and holds the unit
                for 72 hours while an advisor confirms the invoice.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <CostCalculator options={[calculatorOption]} compact />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-line pt-10">
          <div className="flex items-end justify-between">
            <h2 className="display text-[26px] text-forest">Similar units in stock</h2>
            <Link href="/vehicles" className="text-[12.5px] font-semibold text-moss hover:underline">
              All inventory →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <VehicleCard key={item.id} vehicle={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
