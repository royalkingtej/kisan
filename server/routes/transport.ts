import type { Express, Request, Response } from "express";
import { db } from "../db.js";
import { transportListings } from "../../shared/models/schema.js";
import { eq } from "drizzle-orm";

export function registerTransportRoutes(app: Express) {
  app.get("/api/transport", async (req: Request, res: Response) => {
    try {
      const listings = await db.select().from(transportListings).orderBy(transportListings.createdAt);
      res.json(listings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch transport listings" });
    }
  });

  app.post("/api/transport", async (req: Request, res: Response) => {
    try {
      const { type, vehicleName, capacity, pricePerKm, phone, fromLocation, toLocation, lat, lng, userId } = req.body;
      const [listing] = await db.insert(transportListings).values({
        type, vehicleName, capacity, pricePerKm, phone, fromLocation, toLocation, lat, lng, userId,
      }).returning();
      res.status(201).json(listing);
    } catch (err) {
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  app.patch("/api/transport/:id/availability", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { available } = req.body;
      const [updated] = await db.update(transportListings).set({ available }).where(eq(transportListings.id, id)).returning();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update availability" });
    }
  });

  app.delete("/api/transport/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(transportListings).where(eq(transportListings.id, id));
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Failed to delete listing" });
    }
  });
}
