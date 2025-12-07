import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];
        socket.user = user;
        socket.userId = user._id.toString();
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token Provided"));
        };
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        };
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        };
        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
        next();
    } catch (error) {
        console.log("Error in socket authentication:", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }
};