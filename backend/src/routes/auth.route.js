import express from "express";
import { signup, login, logout, updateProfile, sendRecoveryCode,
verifyRecoveryCode, sendNewEmailVerification, recoverEmail, sendPasswordResetCode, resetPassword, verifyPasswordResetCode } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.put("/update-profile", protectRoute, updateProfile);
router.post("/send-new-email-verification", protectRoute, sendNewEmailVerification);
router.post("/recover-email", protectRoute, recoverEmail);
router.post("/send-password-reset-code", protectRoute, sendPasswordResetCode);
router.post("/send-recovery-code", protectRoute, sendRecoveryCode);   
router.post("/verify-recovery-code", verifyRecoveryCode);
router.post("/reset-password", resetPassword);
router.post("/verify-password-reset-code", verifyPasswordResetCode);

router.get("/check", protectRoute, (req,res) => res.status(200).json(req.user));
export default router;