import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  trim: text("trim").notNull().default(""),
  bodyType: text("body_type").notNull(),
  fuel: text("fuel").notNull(),
  transmission: text("transmission").notNull(),
  drivetrain: text("drivetrain").notNull(),
  engineCc: integer("engine_cc").notNull(),
  mileageKm: integer("mileage_km").notNull(),
  color: text("color").notNull(),
  condition: text("condition").notNull().default("Used"),
  originCountry: text("origin_country").notNull(),
  originPort: text("origin_port").notNull(),
  priceUsd: integer("price_usd").notNull(),
  freightUsd: integer("freight_usd").notNull(),
  insuranceUsd: integer("insurance_usd").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  crspKes: integer("crsp_kes").notNull().default(0),
  inspectionGrade: text("inspection_grade").notNull().default("Grade 4.5"),
  status: text("status").notNull().default("available"),
  featured: boolean("featured").notNull().default(false),
  etaWeeks: integer("eta_weeks").notNull().default(8),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  trackingCode: text("tracking_code").notNull().unique(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryCity: text("delivery_city").notNull().default("Nairobi"),
  notes: text("notes").notNull().default(""),
  stage: integer("stage").notNull().default(1),
  status: text("status").notNull().default("Reserved"),
  vesselName: text("vessel_name").notNull().default(""),
  voyageNumber: text("voyage_number").notNull().default(""),
  billOfLading: text("bill_of_lading").notNull().default(""),
  destinationPort: text("destination_port").notNull().default("Mombasa"),
  etd: text("etd").notNull().default(""),
  eta: text("eta").notNull().default(""),
  depositKes: integer("deposit_kes").notNull().default(0),
  totalKes: integer("total_kes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shipmentEvents = pgTable("shipment_events", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  stage: integer("stage").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  location: text("location").notNull().default(""),
  occurredAt: text("occurred_at").notNull().default(""),
  done: boolean("done").notNull().default(false),
});

export const engagements = pgTable("engagements", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  city: text("city").notNull(),
  rating: integer("rating").notNull().default(5),
  title: text("title").notNull(),
  body: text("body").notNull(),
  vehicleName: text("vehicle_name").notNull().default(""),
  trackingCode: text("tracking_code").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  likes: integer("likes").notNull().default(0),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const engagementComments = pgTable("engagement_comments", {
  id: serial("id").primaryKey(),
  engagementId: integer("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type ShipmentEvent = typeof shipmentEvents.$inferSelect;
export type Engagement = typeof engagements.$inferSelect;
export type EngagementComment = typeof engagementComments.$inferSelect;
