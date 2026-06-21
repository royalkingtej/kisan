import type { Express, Request, Response } from "express";
import { db } from "../db.js";
import { sql } from "drizzle-orm";

export function registerMarketRoutes(app: Express) {
  app.get("/api/market", async (req: Request, res: Response) => {
    try {
      const { category, location } = req.query;
      let query = `SELECT * FROM market_listings WHERE available = true`;
      if (category && category !== "all") query += ` AND category = '${String(category).replace(/'/g, "''")}'`;
      if (location) query += ` AND location ILIKE '%${String(location).replace(/'/g, "''")}%'`;
      query += ` ORDER BY created_at DESC LIMIT 50`;
      const result = await db.execute(sql.raw(query));
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  app.get("/api/market/my/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const result = await db.execute(
        sql`SELECT * FROM market_listings WHERE user_id = ${userId} ORDER BY created_at DESC`
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch your listings" });
    }
  });

  app.post("/api/market", async (req: Request, res: Response) => {
    try {
      const { userId, cropName, category, quantity, unit, price, location, description, imageData, phone } = req.body;
      if (!cropName || !price) return res.status(400).json({ error: "Crop name and price are required" });
      const result = await db.execute(sql`
        INSERT INTO market_listings (user_id, crop_name, category, quantity, unit, price, location, description, image_data, phone, available)
        VALUES (${userId || null}, ${cropName}, ${category || "vegetable"}, ${quantity || null}, ${unit || "kg"}, ${parseFloat(price)}, ${location || "India"}, ${description || null}, ${imageData || null}, ${phone || null}, true)
        RETURNING *
      `);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  app.patch("/api/market/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { available, price, quantity } = req.body;
      const result = await db.execute(sql`
        UPDATE market_listings SET
          available = COALESCE(${available ?? null}, available),
          price = COALESCE(${price ? parseFloat(price) : null}, price),
          quantity = COALESCE(${quantity || null}, quantity)
        WHERE id = ${id} RETURNING *
      `);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update listing" });
    }
  });

  app.delete("/api/market/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await db.execute(sql`DELETE FROM market_listings WHERE id = ${id}`);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Failed to delete listing" });
    }
  });
}
