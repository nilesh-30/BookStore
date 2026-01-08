import { Schema, model } from "mongoose";

const itemSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: [true, "Book ID is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: 1,
            default: 1,
        },
    },
    { _id: false },
);

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true,
        },
        items: {
            type: [itemSchema],
            required: [true, "Items are required"],
        },
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const CartModal = model("Cart", cartSchema);

export default CartModal;