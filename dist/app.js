"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use("/api/users", user_routes_1.default);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // local dev
        "http://192.168.56.1:3000", // your LAN access
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
