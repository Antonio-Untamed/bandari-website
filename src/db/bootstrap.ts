import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  engagementComments,
  engagements,
  orders,
  shipmentEvents,
  vehicles,
} from "./schema";
import {
  commentSeeds,
  engagementSeeds,
  orderSeeds,
  vehicleSeeds,
} from "./seed-data";
import { costInputFromVehicle, estimateLandedCost } from "@/lib/pricing";
import { addDays, buildTimeline, isoDate } from "@/lib/shipping";

const DDL = [
  `create table if not exists vehicles (
    id serial primary key,
    slug text not null unique,
    make text not null,
    model text not null,
    year integer not null,
    trim text not null default '',
    body_type text not null,
    fuel text not null,
    transmission text not null,
    drivetrain text not null,
    engine_cc integer not null,
    mileage_km integer not null,
    color text not null,
    condition text not null default 'Used',
    origin_country text not null,
    origin_port text not null,
    price_usd integer not null,
    freight_usd integer not null,
    insurance_usd integer not null default 0,
    image_url text not null,
    gallery jsonb not null default '[]'::jsonb,
    features jsonb not null default '[]'::jsonb,
    crsp_kes integer not null default 0,
    inspection_grade text not null default 'Grade 4.5',
    status text not null default 'available',
    featured boolean not null default false,
    eta_weeks integer not null default 8,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists orders (
    id serial primary key,
    reference text not null unique,
    tracking_code text not null unique,
    vehicle_id integer not null references vehicles(id),
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    delivery_city text not null default 'Nairobi',
    notes text not null default '',
    stage integer not null default 1,
    status text not null default 'Reserved',
    vessel_name text not null default '',
    voyage_number text not null default '',
    bill_of_lading text not null default '',
    destination_port text not null default 'Mombasa',
    etd text not null default '',
    eta text not null default '',
    deposit_kes integer not null default 0,
    total_kes integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists shipment_events (
    id serial primary key,
    order_id integer not null references orders(id) on delete cascade,
    stage integer not null,
    title text not null,
    description text not null default '',
    location text not null default '',
    occurred_at text not null default '',
    done boolean not null default false
  )`,
  `create table if not exists engagements (
    id serial primary key,
    author_name text not null,
    city text not null,
    rating integer not null default 5,
    title text not null,
    body text not null,
    vehicle_name text not null default '',
    tracking_code text not null default '',
    image_url text not null default '',
    likes integer not null default 0,
    pinned boolean not null default false,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists engagement_comments (
    id serial primary key,
    engagement_id integer not null references engagements(id) on delete cascade,
    author_name text not null,
    body text not null,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists inquiries (
    id serial primary key,
    name text not null,
    email text not null,
    phone text not null default '',
    budget text not null default '',
    message text not null default '',
    created_at timestamptz not null default now()
  )`,
  `alter table vehicles add column if not exists crsp_kes integer not null default 0`,
];

/**
 * Indicative KRA CRSP (new retail price in Kenya) captured per unit.
 * Admin-uploaded units carry their own CRSP; this map backfills the seed stock.
 */
const CRSP_SEEDS: Record<string, number> = {
  "toyota-land-cruiser-prado-txl-2021": 9095659,
  "mercedes-benz-gle-350d-2020": 12480000,
  "toyota-hilux-revo-2022": 6950000,
  "bmw-x5-xdrive30d-2019": 10650000,
  "toyota-prado-vx-2022": 10420000,
  "toyota-premio-f-ex-2019": 3420000,
  "toyota-vios-1-5-2020": 3150000,
  "toyota-mark-x-250g-2018": 4380000,
  "mercedes-benz-g63-amg-2019": 26500000,
  "toyota-auris-hybrid-2017": 2890000,
  "toyota-land-cruiser-prado-2016": 7800000,
  "toyota-hilux-double-cab-2021": 6420000,
};

async function createTables() {
  for (const statement of DDL) {
    await db.execute(sql.raw(statement));
  }
}

async function seedData() {
  const existing = await db.select({ id: vehicles.id }).from(vehicles).limit(1);

  for (const [slug, crspKes] of Object.entries(CRSP_SEEDS)) {
    await db.execute(
      sql`update vehicles set crsp_kes = ${crspKes} where slug = ${slug} and crsp_kes = 0`,
    );
  }

  if (existing.length === 0) {
    const inserted = await db
      .insert(vehicles)
      .values(
        vehicleSeeds.map((seed) => ({
          ...seed,
          crspKes: CRSP_SEEDS[seed.slug] ?? 0,
        })),
      )
      .returning();
    const bySlug = new Map(inserted.map((vehicle) => [vehicle.slug, vehicle]));

    for (const seed of orderSeeds) {
      const vehicle = bySlug.get(seed.vehicleSlug);
      if (!vehicle) continue;

      const cost = estimateLandedCost(costInputFromVehicle(vehicle));
      const startedAt = addDays(-seed.startedDaysAgo);

      const [order] = await db
        .insert(orders)
        .values({
          reference: seed.reference,
          trackingCode: seed.trackingCode,
          vehicleId: vehicle.id,
          customerName: seed.customerName,
          customerEmail: seed.customerEmail,
          customerPhone: seed.customerPhone,
          deliveryCity: seed.deliveryCity,
          notes: seed.notes,
          stage: seed.stage,
          status: seed.stage >= 7 ? "Delivered" : "In progress",
          vesselName: seed.vesselName,
          voyageNumber: seed.voyageNumber,
          billOfLading: seed.billOfLading,
          etd: isoDate(addDays(16 - seed.startedDaysAgo, new Date())),
          eta: isoDate(addDays(seed.etaInDays)),
          depositKes: cost.depositKes,
          totalKes: cost.totalKes,
          createdAt: startedAt,
          updatedAt: addDays(-1),
        })
        .returning();

      const timeline = buildTimeline(seed.stage, {
        startDate: startedAt,
        originPort: `${vehicle.originPort}, ${vehicle.originCountry}`,
        vesselName: seed.vesselName,
      });

      await db.insert(shipmentEvents).values(
        timeline.map((event) => ({
          orderId: order.id,
          stage: event.stage,
          title: event.title,
          description: event.description,
          location: event.location,
          occurredAt: event.occurredAt,
          done: event.done,
        })),
      );
    }
  }

  const existingEngagements = await db
    .select({ id: engagements.id })
    .from(engagements)
    .limit(1);

  if (existingEngagements.length === 0) {
    const inserted = await db
      .insert(engagements)
      .values(
        engagementSeeds.map((seed, index) => ({
          ...seed,
          createdAt: addDays(-(index * 6 + 3)),
        })),
      )
      .returning();

    for (const engagement of inserted) {
      const comments = commentSeeds[engagement.trackingCode];
      if (!comments || comments.length === 0) continue;
      await db.insert(engagementComments).values(
        comments.map((comment, index) => ({
          engagementId: engagement.id,
          authorName: comment.authorName,
          body: comment.body,
          createdAt: addDays(-(index + 1)),
        })),
      );
    }
  }
}

let bootstrapPromise: Promise<void> | null = null;

async function run() {
  await createTables();
  await db.execute(sql`select pg_advisory_lock(4930221)`);
  try {
    await seedData();
  } finally {
    await db.execute(sql`select pg_advisory_unlock(4930221)`);
  }
}

export function ensureDb() {
  if (!bootstrapPromise) {
    bootstrapPromise = run().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }
  return bootstrapPromise;
}
