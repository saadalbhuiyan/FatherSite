import express from "express";
import { sendOtp, verifyOtp, logout } from "../controllers/adminAuthController.js";
import { adminAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", adminAuth, logout);  // optional guard

export default router;