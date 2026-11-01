import Link from "next/link";
import type { Vehicle } from "@/db/schema";
import { costInputFromVehicle, estimateLandedCost } from "@/lib/pricing";
import { compactKes, usd } from "@/lib/format";
import { ArrowUpRight, PinIcon } from "./icons";
import { StatusBadge } from "./ui";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const landed = estimateLandedCost(costInputFromVehicle(vehicle));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-[0_24px_50px_-30px_rgba(16,36,29,0.45)]">
      <Link href={`/vehicles/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <StatusBadge status={vehicle.status} />
          <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cream backdrop-blur">
            {vehicle.inspectionGrade}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold leading-snug text-forest">
              <Link href={`/vehicles/${vehicle.slug}`} className="hover:underline">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Link>
            </h3>
            <p className="mt-0.5 text-[12px] text-ink/50">{vehicle.trim || vehicle.bodyType}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-ink/50">
            <PinIcon className="h-3.5 w-3.5" />
            {vehicle.originCountry}
          </span>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11.5px] text-ink/60">
          <li>{vehicle.mileageKm.toLocaleString()} km</li>
          <li aria-hidden="true">·</li>
          <li>{vehicle.fuel}</li>
          <li aria-hidden="true">·</li>
          <li>{vehicle.transmission}</li>
          <li aria-hidden="true">·</li>
          <li>{vehicle.drivetrain}</li>
        </ul>

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-[17px] font-semibold text-forest">{usd(vehicle.priceUsd)}</p>
            <p className="text-[11px] text-ink/50">
              est. landed {compactKes(landed.totalKes)} incl. duty
            </p>
          </div>
          <Link
            href={`/vehicles/${vehicle.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 px-3.5 py-2 text-[12px] font-semibold text-forest transition group-hover:border-forest group-hover:bg-forest group-hover:text-cream"
          >
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
