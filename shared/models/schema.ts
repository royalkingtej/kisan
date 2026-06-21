import { pgTable, serial, integer, text, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Kisan User"),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  avatar: text("avatar"),
  location: text("location").default("India"),
  lat: real("lat"),
  lng: real("lng"),
  farmSize: text("farm_size"),
  cropTypes: text("crop_types"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const otpSessions = pgTable("otp_sessions", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const diseaseScans = pgTable("disease_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  imageData: text("image_data"),
  diseaseName: text("disease_name"),
  confidence: real("confidence"),
  severity: text("severity"),
  affectedCrop: text("affected_crop"),
  symptoms: text("symptoms"),
  treatment: text("treatment"),
  prevention: text("prevention"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  type: text("type").default("general"),
  scanId: integer("scan_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const transportListings = pgTable("transport_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(),
  vehicleName: text("vehicle_name").notNull(),
  capacity: text("capacity"),
  pricePerKm: real("price_per_km"),
  phone: text("phone"),
  fromLocation: text("from_location"),
  toLocation: text("to_location"),
  lat: real("lat"),
  lng: real("lng"),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type OtpSession = typeof otpSessions.$inferSelect;
export type DiseaseScan = typeof diseaseScans.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type TransportListing = typeof transportListings.$inferSelect;
