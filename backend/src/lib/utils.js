import jwt from "jsonwebtoken";
import {ENV} from "./env.js";

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    };
    const token = jwt.sign({userId}, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "development" ? false : true,
    });
    return token
};
export const generateTempToken = (userId, res) => {
    const { JWT_TEMP_SECRET } = ENV;
    if (!JWT_TEMP_SECRET) {
        throw new Error("JWT_TEMP_SECRET is not configured");
    };
    const token = jwt.sign({userId}, JWT_TEMP_SECRET, {
        expiresIn: "5m",
    });
    res.cookie("jwt_temp", token, {
        maxAge: 5*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "development" ? false : true,
    });
    return token
};