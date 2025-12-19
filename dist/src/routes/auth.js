"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const db_1 = require("../utils/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Allow frontend dev origins
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // React dev
        "http://localhost:5173", // Vite dev
    ],
    credentials: true,
}));
// Routes
app.use("/api/auth", auth_routes_1.default);
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
(0, db_1.initDb)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Backend listening on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error(" Failed to initialize DB:", err);
    process.exit(1);
});
