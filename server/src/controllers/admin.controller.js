import UserModel from "../models/userModel.js";
import BookModel from "../models/booksModel.js";
import OrderModel from "../models/orderModel.js";


// ================= USER MANAGEMENT =================

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password");

        res.status(200).json({
            total: users.length,
            users,
        });
        
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Ban or Unban user
const toggleBanUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.status(200).json({
            message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
        });

    } catch (error) {
        console.error("Error toggling user ban status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete user permanently
const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();

        res.status(200).json({
            message: "User deleted permanently",
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// ================= ORDER MANAGEMENT =================

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            total: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all orders of a specific user
const getOrdersByUser = async (req, res) => {
    try {
        const orders = await OrderModel.find({ user: req.params.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            total: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// ================= BOOK MANAGEMENT =================

// Delete book
const deleteBook = async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await book.deleteOne();

        res.status(200).json({
            message: "Book deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Hide / Unhide book
const toggleHideBook = async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        book.isHidden = !book.isHidden;
        await book.save();

        res.status(200).json({
            message: `Book ${book.isHidden ? "hidden" : "visible"} successfully`,
        });

    } catch (error) {
        console.error("Error toggling book visibility:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    getAllUsers,
    toggleBanUser,
    deleteUser,
    getAllOrders,
    getOrdersByUser,
    deleteBook,
    toggleHideBook,
};