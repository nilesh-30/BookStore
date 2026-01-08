import { Schema, model } from "mongoose";

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        image: {
            type: String,
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: 0,
            default: 1,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const BookModel = model("Book", bookSchema);

export default BookModel;