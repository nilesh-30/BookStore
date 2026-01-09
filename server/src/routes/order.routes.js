import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { placeOrder, getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/place-order", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);

export default router;