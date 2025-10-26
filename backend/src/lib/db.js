import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully: ", conn.connection.host);
    } catch (error) {
        console.error("error connected to mongodb: ", error);
        process.exit(1);
    }
}