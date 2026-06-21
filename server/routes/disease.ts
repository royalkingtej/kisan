import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { db } from "../db.js";
import { diseaseScans, conversations, messages } from "../../shared/models/schema.js";
import { eq, desc } from "drizzle-orm";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

const DISEASE_SYSTEM_PROMPT = `You are an expert agricultural plant pathologist and crop disease specialist with deep knowledge of Indian farming practices. 
Analyze plant/crop images with high precision and provide:
1. Disease identification with scientific and common names
2. Confidence level (0-100%)
3. Severity (Mild/Moderate/Severe/Critical)
4. Affected crop type
5. Detailed symptoms observed
6. Immediate treatment steps (chemical, biological, and organic options)
7. Prevention strategies

Always respond in this exact JSON format:
{
  "diseaseName": "Disease name (Scientific name)",
  "confidence": 87,
  "severity": "Moderate",
  "affectedCrop": "Tomato",
  "symptoms": "Yellow-brown spots on leaves with concentric rings...",
  "treatment": "1. Remove infected leaves immediately...\n2. Apply fungicide...\n3. Organic option: Neem oil spray...",
  "prevention": "1. Crop rotation...\n2. Proper spacing...\n3. Avoid overhead irrigation..."
}`;

const DISEASE_CHAT_SYSTEM = `You are an expert agricultural assistant specializing in plant diseases, crop health, and Indian farming practices.
You have detailed knowledge about:
- Plant diseases, their causes (fungal, bacterial, viral, pest)
- Treatment methods (chemical, biological, organic)
- Preventive measures and IPM (Integrated Pest Management)
- Indian crops: rice, wheat, cotton, sugarcane, tomato, potato, etc.
- Government schemes for farmers (PM-KISAN, crop insurance, etc.)
- Seasonal farming advice

Be helpful, specific, and practical. Give advice in simple language. When discussing treatments, always mention:
1. Immediate action needed
2. Chemical treatment with dosage
3. Organic/natural alternatives
4. When to consult an agricultural extension officer`;

export function registerDiseaseRoutes(app: Express) {
  app.post("/api/disease/detect", async (req: Request, res: Response) => {
    try {
      const { imageBase64, userId } = req.body;
      if (!imageBase64) return res.status(400).json({ error: "Image data required" });

      const openai = getOpenAI();
      const imageUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: DISEASE_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this plant/crop image for diseases. Provide detailed diagnosis in the exact JSON format specified." },
              { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
            ],
          },
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      let result: any;
      try {
        result = JSON.parse(raw);
      } catch {
        result = {
          diseaseName: "Unknown Disease",
          confidence: 50,
          severity: "Moderate",
          affectedCrop: "Unknown",
          symptoms: "Unable to analyze image clearly.",
          treatment: "Please consult your local agricultural extension officer.",
          prevention: "Maintain good farming practices.",
        };
      }

      const [scan] = await db.insert(diseaseScans).values({
        userId: userId || null,
        imageData: imageBase64.slice(0, 200),
        diseaseName: result.diseaseName,
        confidence: result.confidence,
        severity: result.severity,
        affectedCrop: result.affectedCrop,
        symptoms: result.symptoms,
        treatment: result.treatment,
        prevention: result.prevention,
      }).returning();

      const [convo] = await db.insert(conversations).values({
        userId: userId || null,
        title: `${result.affectedCrop} - ${result.diseaseName}`,
        type: "disease",
        scanId: scan.id,
      }).returning();

      await db.insert(messages).values({
        conversationId: convo.id,
        role: "assistant",
        content: `I've analyzed your crop image and detected **${result.diseaseName}** on **${result.affectedCrop}** with **${result.confidence}% confidence**.

**Severity:** ${result.severity}

**Symptoms observed:**
${result.symptoms}

**Recommended Treatment:**
${result.treatment}

**Prevention:**
${result.prevention}

Feel free to ask me any questions about this disease or treatment methods!`,
      });

      res.json({ ...result, scanId: scan.id, conversationId: convo.id });
    } catch (err) {
      console.error("disease detect error:", err);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  app.get("/api/disease/history/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const scans = await db.select().from(diseaseScans).where(eq(diseaseScans.userId, userId)).orderBy(desc(diseaseScans.createdAt)).limit(20);
      res.json(scans);
    } catch (err) {
      res.status(500).json({ error: "Failed to get history" });
    }
  });

  app.get("/api/disease/conversation/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const [convo] = await db.select().from(conversations).where(eq(conversations.id, id));
      if (!convo) return res.status(404).json({ error: "Not found" });
      const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
      res.json({ ...convo, messages: msgs });
    } catch (err) {
      res.status(500).json({ error: "Failed to get conversation" });
    }
  });

  app.post("/api/disease/chat/:conversationId", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { content, scanContext } = req.body;

      await db.insert(messages).values({ conversationId, role: "user", content });

      const allMsgs = await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
      const chatHistory = allMsgs.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const openai = getOpenAI();
      const systemContent = scanContext
        ? `${DISEASE_CHAT_SYSTEM}\n\nCurrent disease context:\n${scanContext}`
        : DISEASE_CHAT_SYSTEM;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemContent }, ...chatHistory],
        stream: true,
        max_completion_tokens: 2000,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          fullResponse += delta;
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
      }

      await db.insert(messages).values({ conversationId, role: "assistant", content: fullResponse });
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      console.error("disease chat error:", err);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Chat failed" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Chat failed" });
      }
    }
  });

  app.post("/api/chat/general", async (req: Request, res: Response) => {
    try {
      const { content, conversationId } = req.body;

      let convId = conversationId;
      if (!convId) {
        const [newConvo] = await db.insert(conversations).values({ title: content.slice(0, 50), type: "general" }).returning();
        convId = newConvo.id;
      }

      await db.insert(messages).values({ conversationId: convId, role: "user", content });
      const allMsgs = await db.select().from(messages).where(eq(messages.conversationId, convId)).orderBy(messages.createdAt);
      const chatHistory = allMsgs.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const openai = getOpenAI();
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: DISEASE_CHAT_SYSTEM }, ...chatHistory],
        stream: true,
        max_completion_tokens: 2000,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          fullResponse += delta;
          res.write(`data: ${JSON.stringify({ content: delta, conversationId: convId })}\n\n`);
        }
      }

      await db.insert(messages).values({ conversationId: convId, role: "assistant", content: fullResponse });
      res.write(`data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`);
      res.end();
    } catch (err) {
      console.error("general chat error:", err);
      if (res.headersSent) { res.write(`data: ${JSON.stringify({ error: "Chat failed" })}\n\n`); res.end(); }
      else res.status(500).json({ error: "Chat failed" });
    }
  });
}
