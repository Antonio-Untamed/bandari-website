import { and, asc, desc, eq, ilike, inArray, lte, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import {
  engagementComments,
  engagements,
  inquiries,
  orders,
  shipmentEvents,
  vehicles,
  type Engagement,
  type EngagementComment,
  type Order,
  type ShipmentEvent,
  type Vehicle,
} from "@/db/schema";

export type VehicleFilters = {
  q?: string;
  make?: string;
  body?: string;
  fuel?: string;
  origin?: string;
  maxPrice?: string;
  sort?: string;
};

export async function getVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  await ensureDb();

  const conditions = [];

  if (filters.q && filters.q.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(vehicles.make, term),
        ilike(vehicles.model, term),
        ilike(vehicles.trim, term),
        ilike(vehicles.bodyType, term),
      ),
    );
  }
  if (filters.make && filters.make !== "all") conditions.push(eq(vehicles.make, filters.make));
  if (filters.body && filters.body !== "all") conditions.push(eq(vehicles.bodyType, filters.body));
  if (filters.fuel && filters.fuel !== "all") conditions.push(eq(vehicles.fuel, filters.fuel));
  if (filters.origin && filters.origin !== "all") {
    conditions.push(eq(vehicles.originCountry, filters.origin));
  }
  const max = Number(filters.maxPrice);
  if (filters.maxPrice && !Number.isNaN(max) && max > 0) {
    conditions.push(lte(vehicles.priceUsd, max));
  }

  const orderBy =
    filters.sort === "price-asc"
      ? asc(vehicles.priceUsd)
      : filters.sort === "price-desc"
        ? desc(vehicles.priceUsd)
        : filters.sort === "year-desc"
          ? desc(vehicles.year)
          : filters.sort === "mileage-asc"
            ? asc(vehicles.mileageKm)
            : desc(vehicles.featured);

  return db
    .select()
    .from(vehicles)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy, desc(vehicles.createdAt));
}

export async function getFeaturedVehicles(limit = 4): Promise<Vehicle[]> {
  await ensureDb();
  return db
    .select()
    .from(vehicles)
    .where(eq(vehicles.featured, true))
    .orderBy(desc(vehicles.priceUsd))
    .limit(limit);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  await ensureDb();
  const rows = await db.select().from(vehicles).where(eq(vehicles.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getRelatedVehicles(vehicle: Vehicle, limit = 3): Promise<Vehicle[]> {
  await ensureDb();
  const sameBody = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.bodyType, vehicle.bodyType), ne(vehicles.id, vehicle.id)))
    .limit(limit);
  if (sameBody.length >= limit) return sameBody;
  const fallback = await db
    .select()
    .from(vehicles)
    .where(ne(vehicles.id, vehicle.id))
    .orderBy(desc(vehicles.featured))
    .limit(limit);
  const map = new Map([...sameBody, ...fallback].map((item) => [item.id, item]));
  return Array.from(map.values()).slice(0, limit);
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  await ensureDb();
  return db.select().from(vehicles).orderBy(desc(vehicles.featured));
}

export type OrderWithVehicle = { order: Order; vehicle: Vehicle };
export type TrackedShipment = OrderWithVehicle & { events: ShipmentEvent[] };

export async function getShipmentByCode(code: string): Promise<TrackedShipment | null> {
  await ensureDb();
  const needle = code.trim();
  if (!needle) return null;

  const rows = await db
    .select({ order: orders, vehicle: vehicles })
    .from(orders)
    .innerJoin(vehicles, eq(orders.vehicleId, vehicles.id))
    .where(
      or(
        sql`upper(${orders.trackingCode}) = ${needle.toUpperCase()}`,
        sql`upper(${orders.reference}) = ${needle.toUpperCase()}`,
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const events = await db
    .select()
    .from(shipmentEvents)
    .where(eq(shipmentEvents.orderId, row.order.id))
    .orderBy(asc(shipmentEvents.stage));

  return { ...row, events };
}

export async function getShipmentsForEmail(email: string): Promise<OrderWithVehicle[]> {
  await ensureDb();
  return db
    .select({ order: orders, vehicle: vehicles })
    .from(orders)
    .innerJoin(vehicles, eq(orders.vehicleId, vehicles.id))
    .where(ilike(orders.customerEmail, email.trim()))
    .orderBy(desc(orders.createdAt));
}

export async function getRecentShipments(limit = 4): Promise<OrderWithVehicle[]> {
  await ensureDb();
  return db
    .select({ order: orders, vehicle: vehicles })
    .from(orders)
    .innerJoin(vehicles, eq(orders.vehicleId, vehicles.id))
    .orderBy(desc(orders.updatedAt))
    .limit(limit);
}

export type EngagementWithComments = Engagement & { comments: EngagementComment[] };

export async function getEngagements(limit = 30): Promise<EngagementWithComments[]> {
  await ensureDb();
  const posts = await db
    .select()
    .from(engagements)
    .orderBy(desc(engagements.pinned), desc(engagements.createdAt))
    .limit(limit);

  if (posts.length === 0) return [];

  const comments = await db
    .select()
    .from(engagementComments)
    .where(
      inArray(
        engagementComments.engagementId,
        posts.map((post) => post.id),
      ),
    )
    .orderBy(asc(engagementComments.createdAt));

  return posts.map((post) => ({
    ...post,
    comments: comments.filter((comment) => comment.engagementId === post.id),
  }));
}

export type CatalogueStats = {
  totalVehicles: number;
  origins: number;
  cheapestKes: number;
  delivered: number;
};

export async function getCatalogueStats(): Promise<CatalogueStats> {
  await ensureDb();
  const rows = await db
    .select({
      total: sql<number>`count(*)::int`,
      origins: sql<number>`count(distinct ${vehicles.originCountry})::int`,
      cheapestUsd: sql<number>`coalesce(min(${vehicles.priceUsd}), 0)::int`,
    })
    .from(vehicles);

  const deliveredRows = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(orders);

  const cheapestUsd = rows[0]?.cheapestUsd ?? 0;
  return {
    totalVehicles: rows[0]?.total ?? 0,
    origins: rows[0]?.origins ?? 0,
    cheapestKes: Math.round(cheapestUsd * 129 * 1.75),
    delivered: deliveredRows[0]?.total ?? 0,
  };
}

export async function saveInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  message?: string;
}) {
  await ensureDb();
  const [row] = await db
    .insert(inquiries)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      budget: input.budget ?? "",
      message: input.message ?? "",
    })
    .returning();
  return row;
}
