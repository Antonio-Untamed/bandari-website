import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { orders, shipmentEvents, vehicles, type Order, type Vehicle } from "@/db/schema";
import { costInputFromVehicle, estimateLandedCost } from "./pricing";
import { buildTimeline, isoDate, addDays } from "./shipping";

export type CreateOrderInput = {
  vehicleSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryCity?: string;
  notes?: string;
};

export type CreateOrderResult = { order: Order; vehicle: Vehicle };

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function randomDigits(length: number) {
  let out = "";
  for (let i = 0; i < length; i += 1) out += Math.floor(Math.random() * 10).toString();
  return out;
}

function randomLetters(length: number) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

async function uniqueCode(column: "tracking_code" | "reference") {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate =
      column === "tracking_code"
        ? `BND-${randomDigits(4)}-${randomLetters(2)}`
        : `KAI-${new Date().getFullYear()}-${randomDigits(4)}`;
    const existing = await db.execute(
      column === "tracking_code"
        ? sql`select id from orders where tracking_code = ${candidate} limit 1`
        : sql`select id from orders where reference = ${candidate} limit 1`,
    );
    const rows = Array.isArray(existing)
      ? existing
      : ((existing as { rows?: unknown[] }).rows ?? []);
    if (rows.length === 0) return candidate;
  }
  return column === "tracking_code"
    ? `BND-${Date.now().toString().slice(-4)}-${randomLetters(2)}`
    : `KAI-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
}

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  await ensureDb();

  const name = input.customerName?.trim();
  const email = input.customerEmail?.trim();
  const phone = input.customerPhone?.trim();

  if (!input.vehicleSlug) throw new OrderError("A vehicle must be selected.", 400);
  if (!name || name.length < 2) throw new OrderError("Please share your full name.", 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new OrderError("A valid email address is required for tracking updates.", 400);
  }
  if (!phone || phone.replace(/\D/g, "").length < 9) {
    throw new OrderError("A reachable phone number is required.", 400);
  }

  const vehicleRows = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.slug, input.vehicleSlug))
    .limit(1);
  const vehicle = vehicleRows[0];
  if (!vehicle) throw new OrderError("That vehicle is no longer listed.", 404);

  const cost = estimateLandedCost(costInputFromVehicle(vehicle));
  const trackingCode = await uniqueCode("tracking_code");
  const reference = await uniqueCode("reference");
  const now = new Date();

  const [order] = await db
    .insert(orders)
    .values({
      reference,
      trackingCode,
      vehicleId: vehicle.id,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      deliveryCity: input.deliveryCity?.trim() || "Nairobi",
      notes: input.notes?.trim() ?? "",
      stage: 0,
      status: "Reserved",
      vesselName: "",
      voyageNumber: "",
      billOfLading: "",
      destinationPort: "Mombasa",
      etd: "",
      eta: isoDate(addDays(vehicle.etaWeeks * 7)),
      depositKes: cost.depositKes,
      totalKes: cost.totalKes,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const timeline = buildTimeline(0, {
    startDate: now,
    originPort: `${vehicle.originPort}, ${vehicle.originCountry}`,
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

  if (vehicle.status === "available") {
    await db.update(vehicles).set({ status: "reserved" }).where(eq(vehicles.id, vehicle.id));
  }

  return { order, vehicle };
}
