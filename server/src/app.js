import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.send("Book Store API running...");
});

app.use("/api/auth", authRoutes);

export default app;