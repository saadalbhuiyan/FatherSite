import express from "express";
import { sendOtp, verifyOtp, logout, refreshToken } from "../controllers/adminAuthController.js";
import { adminAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/refresh-token", refreshToken); // ✅ Added
router.post("/logout", adminAuth, logout);

export default router;
