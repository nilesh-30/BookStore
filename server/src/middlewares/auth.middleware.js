import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const protect = async (req, res, next) => {
    let token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, token missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔥 FETCH USER FROM DB
        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        // 🚫 Block banned users
        if (user.isBanned) {
            return res.status(403).json({
                message: "Your account has been banned",
            });
        }

        // ✅ Attach full user object
        req.user = user;

        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token invalid",
        });
    }
};

export default protect;
