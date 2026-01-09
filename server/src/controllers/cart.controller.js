import CartModel from "../models/cartModel.js";
import BookModel from "../models/booksModel.js";

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bookId, quantity = 1 } = req.body;

        const book = await BookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        let cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            cart = await CartModel.create({
                user: userId,
                items: [{ book: bookId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.book.toString() === bookId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ book: bookId, quantity });
            }
        }

        // Recalculate total
        cart.totalAmount = 0;
        for (const item of cart.items) {
            const b = await BookModel.findById(item.book);
            cart.totalAmount += b.price * item.quantity;
        }

        await cart.save();

        return res.status(200).json({
            message: "Item added to cart",
            cart,
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getMyCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ user: req.user._id })
            .populate("items.book", "title price image");

        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }

        return res.status(200).json({ cart });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({message: "Internal Server Error" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

        const cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (item) => item.book.toString() === bookId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        item.quantity = quantity;

        // Recalculate total
        cart.totalAmount = 0;
        for (const item of cart.items) {
            const b = await BookModel.findById(item.book);
            cart.totalAmount += b.price * item.quantity;
        }

        await cart.save();

        return res.status(200).json({
            message: "Cart updated",
            cart,
        });

    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params;

        const cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.book.toString() !== bookId
        );

        // Recalculate total
        cart.totalAmount = 0;
        for (const item of cart.items) {
            const b = await BookModel.findById(item.book);
            cart.totalAmount += b.price * item.quantity;
        }

        await cart.save();

        return res.status(200).json({
            message: "Item removed from cart",
            cart,
        });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addToCart, getMyCart, updateCartItem, removeFromCart };