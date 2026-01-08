import BookModel from "../models/booksModel";

const getAllBooks = async (req, res) => {
    try {
        const { keyword, category } = req.query;

        const query = {};

        // Search by title or author
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { author: { $regex: keyword, $options: "i" } },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const books = await BookModel.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            total: books.length,
            data: books,
        });

    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        };

        return res.status(200).json({ data: book });

    } catch (error) {
        console.error("Error fetching book by ID:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            description,
            price,
            category,
            image,
            stock,
        } = req.body;

        if (
            !title ||
            !author ||
            !description ||
            price === undefined ||
            !category ||
            !image
        ) {
            return res.status(400).json({
                message: "All required fields must be provided",
            });
        }

        const book = await BookModel.create({
            title,
            author,
            description,
            price,
            category,
            image,
            stock,
        });

        return res.status(201).json({
            message: "Book created successfully",
            data: book,
        });

    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await BookModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        return res
            .status(200)
            .json({ message: "Book updated successfully", data: book });

    } catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        await book.deleteOne();

        return res.status(200).json({
            message: "Book deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};