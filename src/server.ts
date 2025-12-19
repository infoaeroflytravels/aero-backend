import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { initDb } from "./utils/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// ✅ Updated CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",      // Next.js local dev
      "http://localhost:5173",      // Vite local dev
      "http://192.168.56.1:3000",   // LAN/local network access
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "development" })
);

app.get("/", (_req, res) => {
  res.send(`
    <h2>🚀 Aerovisa CRM Backend Running</h2>
    <p>API Base: <code>/api</code></p>
    <p>Try <a href="/api/health">/api/health</a> to check status.</p>
  `);
});

// ✅ Initialize DB and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize DB:", err);
    process.exit(1);
  });
