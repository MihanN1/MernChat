import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import CSRFMiddleware from "./middleware/csrf.middleware.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use(CSRFMiddleware.generateTokenMiddleware());
app.get('/api/csrf-token', CSRFMiddleware.getTokenHandler());

const vulnerableEndpoints = [
  '/api/auth/recover-email',  
  '/api/auth/send-password-reset-code', 
  '/api/auth/send-recovery-code',  
  '/api/auth/verify-recovery-code',  
  '/api/auth/reset-password',  
  '/api/auth/verify-password-reset-code'
];

vulnerableEndpoints.forEach(endpoint => {
  app.post(endpoint, CSRFMiddleware.validateTokenMiddleware());
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
};
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});