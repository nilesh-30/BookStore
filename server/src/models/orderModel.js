import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "CARD", "UPI"],
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        orderStatus: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

        paidAt: Date,
        deliveredAt: Date,
    },
    { timestamps: true }
);

const OrderModel = model("Order", orderSchema);
export default OrderModel;
