import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import {
  inquiries,
  orders,
  shipmentEvents,
  vehicles,
  type Order,
  type Vehicle,
} from "@/db/schema";

export type VehiclePayload = {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  drivetrain: string;
  engineCc: number;
  mileageKm: number;
  color: string;
  condition?: string;
  originCountry: string;
  originPort: string;
  priceUsd: number;
  freightUsd: number;
  insuranceUsd?: number;
  crspKes?: number;
  imageUrl: string;
  gallery?: string[];
  features?: string[];
  inspectionGrade?: string;
  status?: string;
  featured?: boolean;
  etaWeeks?: number;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export class AdminError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function toInt(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

function cleanList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function normaliseVehicle(body: Record<string, unknown>): VehiclePayload {
  const make = String(body.make ?? "").trim();
  const model = String(body.model ?? "").trim();
  const year = toInt(body.year);
  const priceUsd = toInt(body.priceUsd);
  const imageUrl = String(body.imageUrl ?? "").trim();

  if (!make) throw new AdminError("Make is required.");
  if (!model) throw new AdminError("Model is required.");
  if (year < 1990 || year > new Date().getFullYear() + 1) {
    throw new AdminError("Enter a valid year of manufacture.");
  }
  if (priceUsd <= 0) throw new AdminError("Vehicle price must be greater than zero.");
  if (!imageUrl) throw new AdminError("Add a photo — upload one or paste an image URL.");

  const originCountry = String(body.originCountry ?? "Japan").trim() || "Japan";
  const originPort = String(body.originPort ?? "Yokohama").trim() || "Yokohama";

  return {
    make,
    model,
    year,
    trim: String(body.trim ?? "").trim(),
    bodyType: String(body.bodyType ?? "SUV").trim() || "SUV",
    fuel: String(body.fuel ?? "Petrol").trim() || "Petrol",
    transmission: String(body.transmission ?? "Automatic").trim() || "Automatic",
    drivetrain: String(body.drivetrain ?? "2WD").trim() || "2WD",
    engineCc: toInt(body.engineCc, 1500),
    mileageKm: toInt(body.mileageKm),
    color: String(body.color ?? "White").trim() || "White",
    condition: String(body.condition ?? "Used").trim() || "Used",
    originCountry,
    originPort,
    priceUsd,
    freightUsd: toInt(body.freightUsd, 1500),
    insuranceUsd: toInt(body.insuranceUsd),
    crspKes: toInt(body.crspKes),
    imageUrl,
    gallery: cleanList(body.gallery),
    features: cleanList(body.features),
    inspectionGrade: String(body.inspectionGrade ?? "Grade 4.5").trim() || "Grade 4.5",
    status: ["available", "reserved", "in_transit", "sold"].includes(String(body.status))
      ? String(body.status)
      : "available",
    featured: Boolean(body.featured),
    etaWeeks: Math.max(toInt(body.etaWeeks, 8), 1),
  };
}

export async function createVehicle(body: Record<string, unknown>): Promise<Vehicle> {
  await ensureDb();
  const payload = normaliseVehicle(body);
  const base = slugify(`${payload.make} ${payload.model} ${payload.year}`);
  const existing = await db
    .select({ slug: vehicles.slug })
    .from(vehicles)
    .where(sql`${vehicles.slug} like ${`${base}%`}`);

  let slug = base;
  if (existing.some((row) => row.slug === base)) {
    slug = `${base}-${Date.now().toString().slice(-4)}`;
  }

  const [vehicle] = await db
    .insert(vehicles)
    .values({
      ...payload,
      slug,
      gallery: payload.gallery && payload.gallery.length > 0 ? payload.gallery : [payload.imageUrl],
    })
    .returning();

  return vehicle;
}

export async function updateVehicle(id: number, body: Record<string, unknown>): Promise<Vehicle> {
  await ensureDb();
  const payload = normaliseVehicle(body);
  const [vehicle] = await db
    .update(vehicles)
    .set({
      ...payload,
      gallery: payload.gallery && payload.gallery.length > 0 ? payload.gallery : [payload.imageUrl],
    })
    .where(eq(vehicles.id, id))
    .returning();

  if (!vehicle) throw new AdminError("That vehicle no longer exists.", 404);
  return vehicle;
}

export async function deleteVehicle(id: number) {
  await ensureDb();
  const rows = await db.select({ id: orders.id }).from(orders).where(eq(orders.vehicleId, id)).limit(1);
  if (rows.length > 0) {
    await db.update(vehicles).set({ status: "sold" }).where(eq(vehicles.id, id));
    throw new AdminError(
      "This unit is attached to an order, so it was marked sold instead of deleted.",
      409,
    );
  }
  await db.delete(vehicles).where(eq(vehicles.id, id));
}

export type AdminOrder = { order: Order; vehicle: Vehicle };

export async function getAdminOrders(): Promise<AdminOrder[]> {
  await ensureDb();
  return db
    .select({ order: orders, vehicle: vehicles })
    .from(orders)
    .innerJoin(vehicles, eq(orders.vehicleId, vehicles.id))
    .orderBy(desc(orders.updatedAt));
}

export async function getAdminVehicles(): Promise<Vehicle[]> {
  await ensureDb();
  return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
}

export async function getInquiries() {
  await ensureDb();
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(50);
}

export async function updateOrderShipping(id: number, body: Record<string, unknown>) {
  await ensureDb();
  const stage = Math.min(Math.max(toInt(body.stage, 0), 0), 7);
  const status = stage >= 7 ? "Delivered" : stage >= 4 ? "In transit" : "In progress";

  const [order] = await db
    .update(orders)
    .set({
      stage,
      status,
      vesselName: String(body.vesselName ?? "").trim(),
      voyageNumber: String(body.voyageNumber ?? "").trim(),
      billOfLading: String(body.billOfLading ?? "").trim(),
      etd: String(body.etd ?? "").trim(),
      eta: String(body.eta ?? "").trim(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();

  if (!order) throw new AdminError("Order not found.", 404);

  const events = await db
    .select()
    .from(shipmentEvents)
    .where(eq(shipmentEvents.orderId, id))
    .orderBy(asc(shipmentEvents.stage));

  for (const event of events) {
    const done = event.stage <= stage;
    if (done !== event.done) {
      await db
        .update(shipmentEvents)
        .set({ done })
        .where(eq(shipmentEvents.id, event.id));
    }
  }

  return order;
}

export function adminStats(input: {
  vehicles: Vehicle[];
  orders: AdminOrder[];
  inquiries: { id: number }[];
}) {
  return {
    units: input.vehicles.length,
    available: input.vehicles.filter((vehicle) => vehicle.status === "available").length,
    inTransit: input.vehicles.filter((vehicle) => vehicle.status === "in_transit").length,
    orders: input.orders.length,
    delivered: input.orders.filter(({ order }) => order.stage >= 7).length,
    inquiries: input.inquiries.length,
  };
}
