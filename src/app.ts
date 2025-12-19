import express from "express";
import userRoutes from "./modules/users/user.routes";



import cors from "cors";

const app = express();

app.use("/api/users", userRoutes);

app.use(
  cors({
    origin: [
      "http://localhost:3000",       // local dev
      "http://192.168.56.1:3000",    // your LAN access
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


