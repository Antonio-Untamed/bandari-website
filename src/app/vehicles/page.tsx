import Link from "next/link";
import type { Metadata } from "next";
import { VehicleCard } from "@/components/vehicle-card";
import { SearchIcon } from "@/components/icons";
import { getAllVehicles, getVehicles } from "@/lib/data";
import { estimateLandedCost, costInputFromVehicle } from "@/lib/pricing";
import { compactKes } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vehicle inventory",
  description:
    "Browse inspected import vehicles from Japan, the UK and the UAE with Kenyan landed-cost estimates.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const BODY_TYPES = ["SUV", "Pickup", "Sedan", "Hatchback", "Van"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];

function pick(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function VehiclesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = {
    q: pick(params.q),
    make: pick(params.make),
    body: pick(params.body),
    fuel: pick(params.fuel),
    origin: pick(params.origin),
    maxPrice: pick(params.maxPrice),
    sort: pick(params.sort) || "featured",
  };

  const [vehicles, all] = await Promise.all([getVehicles(filters), getAllVehicles()]);
  const makes = Array.from(new Set(all.map((vehicle) => vehicle.make))).sort();
  const origins = Array.from(new Set(all.map((vehicle) => vehicle.originCountry))).sort();
  const activeCount = [filters.q, filters.make !== "all" ? filters.make : "", filters.body !== "all" ? filters.body : "", filters.fuel !== "all" ? filters.fuel : "", filters.origin !== "all" ? filters.origin : "", filters.maxPrice].filter(Boolean).length;

  return (
    <>
      <section className="border-b border-line bg-sand/50 py-12 sm:py-16">
        <div className="container-page">
          <span className="eyebrow">Inventory · updated daily</span>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="display text-[36px] text-forest sm:text-[46px]">Find your unit</h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/65">
                {all.length} inspected vehicles across {origins.length} markets. Filter by budget,
                body or origin — landed costs include duty, clearing and NTSA registration.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="chip">{vehicles.length} matches</span>
              <Link href="/track" className="btn-outline !py-2.5 text-[13px]">
                Track an order
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          <form action="/vehicles" className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-forest">
                Filters
              </h2>
              {activeCount > 0 ? (
                <Link href="/vehicles" className="text-[11px] font-medium text-clay hover:underline">
                  Clear ({activeCount})
                </Link>
              ) : null}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="filter-q">Search</label>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                  <input
                    id="filter-q"
                    name="q"
                    defaultValue={filters.q}
                    placeholder="Model or trim"
                    className="field !pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="filter-make">Make</label>
                <select id="filter-make" name="make" defaultValue={filters.make || "all"} className="field">
                  <option value="all">All makes</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="filter-body">Body type</label>
                <select id="filter-body" name="body" defaultValue={filters.body || "all"} className="field">
                  <option value="all">All body types</option>
                  {BODY_TYPES.map((body) => (
                    <option key={body} value={body}>{body}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="filter-fuel">Fuel</label>
                <select id="filter-fuel" name="fuel" defaultValue={filters.fuel || "all"} className="field">
                  <option value="all">Any fuel</option>
                  {FUELS.map((fuel) => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="filter-origin">Origin</label>
                <select id="filter-origin" name="origin" defaultValue={filters.origin || "all"} className="field">
                  <option value="all">All markets</option>
                  {origins.map((origin) => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="filter-budget">Max vehicle price (USD)</label>
                <select id="filter-budget" name="maxPrice" defaultValue={filters.maxPrice} className="field">
                  <option value="">Any budget</option>
                  <option value="12000">Up to $12,000</option>
                  <option value="20000">Up to $20,000</option>
                  <option value="35000">Up to $35,000</option>
                  <option value="60000">Up to $60,000</option>
                  <option value="100000">Up to $100,000</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="filter-sort">Sort by</label>
                <select id="filter-sort" name="sort" defaultValue={filters.sort} className="field">
                  <option value="featured">Recommended</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="year-desc">Newest year</option>
                  <option value="mileage-asc">Lowest mileage</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full !py-2.5 text-[13px]">
                Apply filters
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-2xl border border-line bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              Not seeing it?
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink/60">
              We source to order from USS, TAA and Gulf dealer networks. Send a spec and we will quote
              landed cost in 24 hours.
            </p>
            <Link href="/#faq" className="mt-3 inline-flex text-[12px] font-semibold text-moss hover:underline">
              Request a sourcing call →
            </Link>
          </div>
        </aside>

        <div>
          {vehicles.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="display text-[24px] text-forest">No units match that combination</p>
              <p className="mx-auto mt-2 max-w-md text-[13px] text-ink/60">
                Try widening the budget or clearing the body-type filter. New stock lands every week.
              </p>
              <Link href="/vehicles" className="btn-primary mt-5">
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-line bg-white p-5">
                <p className="text-[12px] uppercase tracking-[0.14em] text-ink/45">Price range shown</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/65">
                  Landed totals swing from{" "}
                  <strong className="font-semibold text-forest">
                    {compactKes(
                      Math.min(
                        ...vehicles.map((vehicle) =>
                          estimateLandedCost(costInputFromVehicle(vehicle)).totalKes,
                        ),
                      ),
                    )}
                  </strong>{" "}
                  to{" "}
                  <strong className="font-semibold text-forest">
                    {compactKes(
                      Math.max(
                        ...vehicles.map((vehicle) =>
                          estimateLandedCost(costInputFromVehicle(vehicle)).totalKes,
                        ),
                      ),
                    )}
                  </strong>{" "}
                  for this selection, assuming a 30% deposit and balance on arrival in Mombasa.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
