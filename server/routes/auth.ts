import type { Express, Request, Response } from "express";
import { db } from "../db.js";
import { users, otpSessions } from "../../shared/models/schema.js";
import { eq, desc } from "drizzle-orm";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/send-otp", async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;
      if (!phone) return res.status(400).json({ error: "Phone number required" });

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await db.insert(otpSessions).values({ phone, otp, expiresAt });

      console.log(`[OTP] Phone: ${phone} → OTP: ${otp}`);
      res.json({ success: true, message: "OTP sent successfully", demoOtp: otp });
    } catch (err) {
      console.error("send-otp error:", err);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

      const sessions = await db
        .select()
        .from(otpSessions)
        .where(eq(otpSessions.phone, phone))
        .orderBy(desc(otpSessions.createdAt))
        .limit(1);

      const session = sessions[0];
      if (!session) return res.status(400).json({ error: "No OTP found for this phone" });
      if (new Date() > session.expiresAt) return res.status(400).json({ error: "OTP expired" });
      if (session.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

      await db.update(otpSessions).set({ verified: true }).where(eq(otpSessions.id, session.id));

      let userRow = (await db.select().from(users).where(eq(users.phone, phone)))[0];
      if (!userRow) {
        [userRow] = await db.insert(users).values({ phone, name: "Kisan User" }).returning();
      }

      res.json({ success: true, user: userRow });
    } catch (err) {
      console.error("verify-otp error:", err);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  app.get("/api/auth/user/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.patch("/api/auth/user/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { name, email, location, lat, lng, farmSize, cropTypes, avatar } = req.body;
      const [updated] = await db
        .update(users)
        .set({ name, email, location, lat, lng, farmSize, cropTypes, avatar })
        .where(eq(users.id, id))
        .returning();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
}
