import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors("*"));

// Test route
app.get("/", (req, res) => {
    res.send("Book Store API running...");
});

export default app;
