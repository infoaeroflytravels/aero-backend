import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../modules/auth/auth.routes";
import { initDb } from "../utils/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// Allow frontend dev origins
app.use(cors({
  origin: [
    "http://localhost:3000", // React dev
    "http://localhost:5173", // Vite dev
  ],
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || "development" }));

// Root route fallback
app.get("/", (_req, res) => {
  res.send(`
    <h2>🚀 Aerovisa CRM Backend Running</h2>
    <p>API Base: <code>/api</code></p>
    <p>Try <a href="/api/health">/api/health</a> to check status.</p>
  `);
});

// Initialize DB and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to initialize DB:", err);
    process.exit(1);
  });
