import { Schema, model } from "mongoose";

const cartItemSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { _id: false }
);

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // one active cart per user
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },

        totalAmount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const CartModel = model("Cart", cartSchema);
export default CartModel;