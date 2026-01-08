import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export default app;
