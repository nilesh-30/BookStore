import express from "express";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import {
    getAllUsers,
    toggleBanUser,
    deleteUser,
    getAllOrders,
    getOrdersByUser,
    deleteBook,
    toggleHideBook,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes are protected + admin only
router.use(protect, adminOnly);

// Users
router.get("/users", getAllUsers);
router.put("/users/ban/:userId", toggleBanUser);
router.delete("/users/remove/:userId", deleteUser);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/user/:userId", getOrdersByUser);

// Books
router.delete("/books/remove/:bookId", deleteBook);
router.put("/books/hide/:bookId", toggleHideBook);

export default router;
