import OrderModel from "../models/orderModel.js";
import CartModel from "../models/cartModel.js";

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await CartModel.findOne({ user: userId })
            .populate("items.book");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Validate stock
        for (const item of cart.items) {
            if (item.book.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.book.title}`,
                });
            }
        }

        // Build order items & reduce stock
        const orderItems = [];
        for (const item of cart.items) {
            item.book.stock -= item.quantity;
            await item.book.save();

            orderItems.push({
                book: item.book._id,
                title: item.book.title,
                price: item.book.price,
                quantity: item.quantity,
            });
        }

        const order = await OrderModel.create({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice: cart.totalAmount,
        });

        // Clear cart
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            total: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { placeOrder, getMyOrders };