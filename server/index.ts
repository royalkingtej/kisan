import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { migrate } from "./migrate.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerDiseaseRoutes } from "./routes/disease.js";
import { registerTransportRoutes } from "./routes/transport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

registerAuthRoutes(app);
registerDiseaseRoutes(app);
registerTransportRoutes(app);

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
    console.error("Migration failed:", err);
    process.exit(1);
  });
