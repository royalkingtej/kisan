import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";
import { db } from "./db.js";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Database tables ready");
}

const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

const isProd = process.env.NODE_ENV === "production";
const PORT = isProd ? 5000 : 3001;

if (isProd) {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

migrate()
  .then(() => {
    const host = isProd ? "0.0.0.0" : "localhost";
    app.listen(PORT, host, () => {
      console.log(`Server running on ${host}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to migrate database:", err);
    process.exit(1);
  });
