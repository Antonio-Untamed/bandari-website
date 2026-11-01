import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ReserveForm } from "@/components/reserve-form";
import { getVehicleBySlug } from "@/lib/data";
import { costInputFromVehicle, estimateLandedCost } from "@/lib/pricing";
import { usd } from "@/lib/format";
import { CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserve a vehicle",
  description: "Open your import file and hold a unit for 72 hours.",
};

type Params = Promise<{ slug: string }>;

export default async function ReservePage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const cost = estimateLandedCost(costInputFromVehicle(vehicle));
  const label = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="flex flex-wrap items-center gap-2 text-[12px] text-ink/45">
        <Link href="/vehicles" className="hover:text-forest">Inventory</Link>
        <span>/</span>
        <Link href={`/vehicles/${vehicle.slug}`} className="hover:text-forest">{label}</Link>
        <span>/</span>
        <span className="text-ink/70">Reserve</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <span className="eyebrow">Step 1 of 3 · reservation</span>
          <h1 className="display mt-3 text-[34px] text-forest sm:text-[42px]">
            Open your import file
          </h1>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink/65">
            You are reserving the {label} from {vehicle.originPort}, {vehicle.originCountry}. We hold
            the unit for 72 hours, send a proforma invoice and walk you through the deposit.
          </p>

          <div className="card mt-6 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vehicle.imageUrl}
              alt={label}
              className="h-44 w-full object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13.5px] font-semibold text-forest">{label}</p>
                <p className="text-[13px] font-semibold text-ink/70">{usd(vehicle.priceUsd)}</p>
              </div>
              <p className="mt-1 text-[11.5px] text-ink/50">
                {vehicle.mileageKm.toLocaleString()} km · {vehicle.fuel} · {vehicle.transmission} ·{" "}
                {vehicle.inspectionGrade}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-2.5 text-[12.5px] text-ink/65">
            {[
              "A tracking code is issued the moment you submit.",
              "An advisor calls within one working day to confirm the spec.",
              "Deposit invoice is payable by M-Pesa or bank transfer — never on this site.",
              "Full refund of deposit if inspection reveals a material fault.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ReserveForm
          slug={vehicle.slug}
          vehicleLabel={label}
          totalKes={cost.totalKes}
          depositKes={cost.depositKes}
          etaWeeks={vehicle.etaWeeks}
        />
      </div>
    </div>
  );
}
