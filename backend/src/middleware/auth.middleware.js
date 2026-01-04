import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if(!token) return res.status(401).json({message:"Unauthorized - no token provided"});
        if(!decoded) return res.status(401).json({message: "Unauthorized - invalid token"});
        if(!user) return res.status(404).json({message: "User not found"});
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
export const verifyTempToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt_temp || req.body.tempToken;
        if (!token) return res.status(401).json({ message: "No temporary token provided" });
        const decoded = jwt.verify(token, ENV.JWT_TEMP_SECRET);
        if (!decoded) return res.status(401).json({ message: "Invalid temporary token" });
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
        req.tempUser = user;
        next();
    } catch (error) {
        console.log("Error in verifyTempToken middleware:", error);
        res.status(401).json({message: "Invalid or expired temporary token"});
    }
};