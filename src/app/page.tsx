import Link from "next/link";
import { VehicleCard } from "@/components/vehicle-card";
import { TrackForm } from "@/components/track-form";
import { CostCalculator, type CalculatorOption } from "@/components/cost-calculator";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading, Stars } from "@/components/ui";
import { ArrowUpRight, CheckIcon, ClockIcon, SearchIcon, ShieldIcon, ShipIcon } from "@/components/icons";
import {
  getCatalogueStats,
  getEngagements,
  getFeaturedVehicles,
  getAllVehicles,
} from "@/lib/data";
import { costInputFromVehicle, estimateLandedCost } from "@/lib/pricing";
import { compactKes } from "@/lib/format";
import { SHIPPING_STAGES } from "@/lib/shipping";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    title: "Choose your unit",
    body: "Filter live stock from Yokohama, Nagoya, Southampton and Jebel Ali. Every listing shows the landed-cost estimate before you commit.",
  },
  {
    title: "Reserve & pay 30%",
    body: "We open your import file, issue a proforma invoice and hold the vehicle. No card is charged on the website.",
  },
  {
    title: "Inspect & ship",
    body: "Pre-shipment inspection photos, auction sheet and mileage verification land in your portal before the carrier sails.",
  },
  {
    title: "Track to Mombasa",
    body: "Vessel updates, KPA arrival, duty assessment, NTSA registration and final delivery — all visible against one code.",
  },
];

const FAQS = [
  {
    q: "How long does it take from order to keys?",
    a: "Most units spend 4–6 weeks on the water from Japan or the UAE, plus 2–3 weeks for sourcing, export documents and Mombasa clearance. Our listings quote 7–10 weeks door-to-door, and your tracking page shows the live estimate.",
  },
  {
    q: "How is KRA duty calculated on an imported car?",
    a: "KRA works from the CRSP (Current Retail Selling Price) of the model in its revised schedule, depreciates it by age (up to 65% for vehicles 7+ years old), then taxes the customs value. Import duty is 35% for passenger cars (25% for pickups, commercial units and EVs), excise is 20–35% by engine size (10% for EVs and hybrids), plus IDF 3.5%, RDL 2% and VAT 16%. Our estimator shows each line and compares the CRSP value with your declared CIF value, because KRA uses whichever is higher.",
  },
  {
    q: "What exactly does the landed cost include?",
    a: "Vehicle price (FOB), ocean freight, marine insurance, every KRA tax above, clearing agent, KPA handling, NTSA registration and inland delivery. The calculator separates each line so nothing appears on the invoice unexpectedly.",
  },
  {
    q: "How do I know the mileage is genuine?",
    a: "Every unit is inspected before loading. For Japan we share the auction sheet and JEVIC/QISJ certificate; for the UK the DVLA/MOT history; for UAE exports a pre-shipment inspection report. Photos of the underbody and dashboard odometer are uploaded to your file.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. The standard plan is a 30% deposit to book the unit, with the balance due when the vehicle arrives in Mombasa. Talk to an advisor before reserving if you need a longer schedule.",
  },
  {
    q: "What if the vehicle arrives damaged or not as described?",
    a: "We inspect at the origin yard and again on arrival. Discrepancies are documented and resolved through the marine insurance cover included in your landed cost, or we source a replacement unit at our cost.",
  },
];

const POPULAR = ["SUV", "Pickup", "Sedan"];

export default async function HomePage() {
  const [featured, allVehicles, engagements, stats] = await Promise.all([
    getFeaturedVehicles(4),
    getAllVehicles(),
    getEngagements(3),
    getCatalogueStats(),
  ]);

  const calculatorOptions: CalculatorOption[] = allVehicles.slice(0, 6).map((vehicle) => {
    const cost = estimateLandedCost(costInputFromVehicle(vehicle));
    return {
      id: String(vehicle.id),
      label: `${vehicle.year} ${vehicle.make} ${vehicle.model} — est. ${compactKes(cost.totalKes)}`,
      input: costInputFromVehicle(vehicle),
      href: `/vehicles/${vehicle.slug}`,
      priceUsd: vehicle.priceUsd,
    };
  });

  const cheapestLanded = allVehicles.reduce((lowest, vehicle) => {
    const total = estimateLandedCost(costInputFromVehicle(vehicle)).totalKes;
    return lowest === 0 || total < lowest ? total : lowest;
  }, 0);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-cream">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sand/80 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <div>
            <span className="eyebrow">
              <ShipIcon className="h-4 w-4" />
              Japan · UK · UAE → Mombasa
            </span>
            <h1 className="display mt-5 text-[44px] text-forest sm:text-[58px] lg:text-[64px]">
              Order the car.
              <br />
              <span className="text-moss">Watch it cross</span> the ocean.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">
              Bandari is the Kenyan import desk that shows its work — fixed landed costs up front,
              inspected stock, and a tracking page that updates from the auction yard to your driveway.
            </p>

            <form
              action="/vehicles"
              className="mt-7 flex flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-[0_18px_40px_-32px_rgba(16,36,29,0.6)] sm:flex-row"
            >
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  name="q"
                  placeholder="Prado TX-L, Hilux, X5…"
                  aria-label="Search inventory"
                  className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-ink/35"
                />
              </div>
              <div className="flex gap-2">
                <select
                  name="maxPrice"
                  aria-label="Maximum budget in USD"
                  className="rounded-xl border border-line bg-cream/60 px-3 py-2.5 text-[13px] font-medium text-ink/70 outline-none"
                  defaultValue=""
                >
                  <option value="">Any budget</option>
                  <option value="12000">Under $12k</option>
                  <option value="20000">Under $20k</option>
                  <option value="35000">Under $35k</option>
                  <option value="60000">Under $60k</option>
                </select>
                <button type="submit" className="btn-primary shrink-0 !px-5">
                  Search stock
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-ink/50">
              <span className="font-medium">Popular:</span>
              {POPULAR.map((item) => (
                <Link
                  key={item}
                  href={`/vehicles?body=${item}`}
                  className="rounded-full border border-line bg-white/70 px-3 py-1 font-medium text-forest transition hover:border-moss"
                >
                  {item}s
                </Link>
              ))}
              <Link href="/vehicles" className="underline decoration-line underline-offset-4 hover:text-forest">
                Browse all {stats.totalVehicles} units
              </Link>
            </div>

            <ul className="mt-7 grid gap-2.5 text-[12.5px] text-ink/65 sm:grid-cols-2">
              {[
                "Inspection photos before loading",
                "30% deposit, balance on arrival",
                "Duty & levies quoted line by line",
                "NTSA registration included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 shrink-0 text-fern" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[26px] border border-line bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-coastal.jpg"
                alt="Imported SUV on a Kenyan coastal road at golden hour"
                className="h-[420px] w-full object-cover sm:h-[500px]"
              />
            </div>

            <div className="absolute -left-2 top-5 rounded-xl border border-line bg-cream/95 px-4 py-3 shadow-lg backdrop-blur sm:left-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                Now tracking
              </p>
              <p className="mt-1 font-mono text-[13px] font-semibold text-forest">BND-4820-KE</p>
              <p className="mt-0.5 text-[11px] text-ink/55">Prado TX-L · MV Hoegh Trapper</p>
            </div>

            <div className="absolute -bottom-5 left-3 right-3 rounded-2xl border border-line bg-white/95 p-4 shadow-[0_24px_60px_-30px_rgba(16,36,29,0.55)] backdrop-blur sm:left-6 sm:right-auto sm:w-[340px]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  Mombasa arrival
                </p>
                <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-forest">
                  57% cleared
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                <div className="h-full w-[57%] rounded-full bg-moss" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11.5px]">
                <span className="text-ink/55">Yokohama → Mombasa</span>
                <span className="font-semibold text-forest">ETA 17 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-line bg-sand/50">
        <div className="container-page grid grid-cols-2 divide-line py-6 sm:grid-cols-4 sm:divide-x">
          {[
            { value: "1,900+", label: "vehicles landed since 2016" },
            { value: `${stats.totalVehicles}`, label: "units in live stock" },
            { value: "8–10 wks", label: "average door-to-door" },
            { value: "100%", label: "duty shown before deposit" },
          ].map((stat) => (
            <div key={stat.label} className="px-2 py-3 sm:px-6">
              <p className="display text-[26px] text-forest">{stat.value}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-ink/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED INVENTORY */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Live stock"
          title="Units inspected and ready to reserve"
          description="Priced in USD at origin, with the Kenyan landed cost calculated for you. A reserved unit is held for 72 hours while we confirm your invoice."
          action={
            <Link href="/vehicles" className="btn-outline">
              View all inventory
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
        <p className="mt-5 text-[12px] text-ink/45">
          Landed units start from {compactKes(cheapestLanded)} including duty, clearing and delivery ·
          figures track the USD/KES rate used in the estimator.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-line bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, one tracking code"
            description="You do the choosing. We handle the sourcing, inspection, shipping and Kenyan paperwork — and post every milestone where you can see it."
            action={
              <Link href="/track" className="btn-outline">
                <ShipIcon className="h-4 w-4" />
                See a live shipment
              </Link>
            }
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-line bg-cream/60 p-5">
                <span className="display text-[30px] text-moss/30">0{index + 1}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-forest">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 rounded-2xl border border-line bg-cream p-5 sm:p-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow">
                <ClockIcon className="h-4 w-4" />
                What tracking feels like
              </span>
              <h3 className="display mt-3 text-[28px] text-forest">
                No more “the car is somewhere on the ocean.”
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">
                Every order gets a code the moment you reserve. Share it with family or your insurer;
                it opens the same live view of vessel position, documents, duty and delivery.
              </p>
              <div className="mt-5">
                <TrackForm />
              </div>
            </div>
            <ol className="relative space-y-3 border-l border-line pl-5">
              {SHIPPING_STAGES.slice(2, 7).map((stage, index) => (
                <li key={stage.key} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 ${
                      index < 3 ? "border-moss bg-moss" : "border-line bg-cream"
                    }`}
                  />
                  <p className={`text-[13px] font-semibold ${index < 3 ? "text-forest" : "text-ink/40"}`}>
                    {stage.label}
                  </p>
                  <p className="text-[11.5px] leading-snug text-ink/50">{stage.blurb}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* TRACKING BAND */}
      <section className="bg-forest py-16 text-cream sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Shipment visibility"
              title="Your vehicle, tracked to the day"
              description="Enter the tracking code from your reservation email. You will see the vessel, voyage, bill of lading, customs stage and the next thing you need to do."
            />
            <div className="mt-7 max-w-xl">
              <TrackForm tone="dark" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/track" className="btn-cream !py-2.5 text-[13px]">
                Open the tracking desk
              </Link>
              <Link
                href="/engagements"
                className="btn border border-cream/25 !py-2.5 text-[13px] text-cream hover:bg-cream/10"
              >
                Read client engagements
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-cream/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.pexels.com/photos/2217513/pexels-photo-2217513.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000"
              alt="Car carrier vessel docked at port"
              className="h-[300px] w-full object-cover sm:h-[360px]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest via-forest/70 to-transparent p-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-cream/60">
                <span>Yokohama</span>
                <span>Mombasa</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-cream/20">
                <div className="h-full w-[57%] rounded-full bg-clay" />
              </div>
              <p className="mt-2 text-[12px] text-cream/70">
                RoRo carrier · 18 decks · marine insurance included in every quote
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COSTS */}
      <section id="costs" className="container-page py-16 sm:py-20">
        <div className="grid gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              eyebrow="No mystery money"
              title="The real price to drive it home"
              description="Duty is not a vibe. Pick any unit and see the KRA calculation, clearing fees and registration broken out before you pay a deposit."
            />
            <div className="mt-6 space-y-3">
              {[
                "Valuation: depreciated KRA CRSP (July 2025 revision)",
                "Import duty: 35% passenger · 25% pickups, commercial & EVs",
                "Excise: 20% – 35% by engine size, 10% for EVs and hybrids",
                "VAT 16% · IDF 3.5% · RDL 2% · clearing, plates and delivery",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5 text-[13px] text-ink/65">
                  <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-line bg-sand/60 p-4 text-[12px] leading-relaxed text-ink/55">
              We use KRA&apos;s revised CRSP schedule, apply age depreciation (up to 65%), then show
              import duty, excise, IDF, RDL and VAT line by line. Switch the estimator to{" "}
              <strong className="text-ink/70">KRA duty (CRSP)</strong> to see the customs maths, or{" "}
              <strong className="text-ink/70">Full landed cost</strong> for the drive-away total. Your
              KRA assessment at Mombasa is the final word.
            </div>
          </div>
          <div>
            {calculatorOptions.length > 0 ? (
              <CostCalculator options={calculatorOptions} compact />
            ) : null}
          </div>
        </div>
      </section>

      {/* ORIGINS */}
      <section className="border-y border-line bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Three ports, one destination"
            title="Sourced where the stock is honest"
            description="We buy from licensed auction houses and franchised dealers in three markets, then consolidate at the port with our clearing partners in Mombasa."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                port: "Yokohama & Nagoya",
                country: "Japan",
                image:
                  "https://images.pexels.com/photos/11114270/pexels-photo-11114270.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800",
                copy: "USS and TAA auction access, JEVIC/QISJ certificates, 4–6 week sailings to Mombasa.",
                transit: "35–45 days",
              },
              {
                port: "Southampton",
                country: "United Kingdom",
                image:
                  "https://images.pexels.com/photos/35016609/pexels-photo-35016609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800",
                copy: "DVLA history and full MOT trail on European specs, ideal for premium SUVs and estates.",
                transit: "38–50 days",
              },
              {
                port: "Jebel Ali",
                country: "United Arab Emirates",
                image:
                  "https://images.pexels.com/photos/31244440/pexels-photo-31244440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800",
                copy: "Gulf-spec 4x4s and performance SUVs with faster rotations and lower freight.",
                transit: "18–26 days",
              },
            ].map((origin) => (
              <article key={origin.country} className="overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={origin.image}
                  alt={`Vehicles and port in ${origin.country}`}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-forest">{origin.port}</h3>
                    <span className="chip">{origin.country}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{origin.copy}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-[11.5px] font-medium text-moss">
                    <ClockIcon className="h-3.5 w-3.5" />
                    Sail time {origin.transit}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Engagements"
          title="From our clients, in their words"
          description="Every review on the wall comes from a real import file. Clients can add photos, ask follow-ups and reply to each other."
          action={
            <Link href="/engagements" className="btn-outline">
              Visit the engagement wall
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {engagements.map((post) => (
            <article key={post.id} className="card flex flex-col overflow-hidden">
              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={`${post.authorName} with their imported vehicle`}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <Stars rating={post.rating} />
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-forest">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink/60">{post.body}</p>
                <div className="mt-auto flex items-center gap-2 pt-4 text-[11.5px] text-ink/55">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-sand text-[11px] font-semibold text-forest">
                    {post.authorName.slice(0, 1)}
                  </span>
                  <span className="font-medium text-ink/75">{post.authorName}</span>
                  <span>· {post.city}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ + INQUIRY */}
      <section id="faq" className="border-t border-line bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading eyebrow="Straight answers" title="Questions we get at the desk" />
            <div className="mt-7 divide-y divide-line border-y border-line">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-forest [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-ink/50 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 pr-8 text-[13px] leading-relaxed text-ink/60">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-forest p-1">
            <div className="rounded-[22px] p-5 sm:p-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
