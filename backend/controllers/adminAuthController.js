// Import required libraries and modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { sendMail } from "../utils/mailer.js";

// ===== Configuration =====
// Generates a 6-digit OTP as a string
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// OTP will be valid for 5 minutes
const OTP_EXPIRY_MINUTES = 5;

/**
 * Send OTP to admin's email
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Generate OTP and calculate expiry time
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Check if admin already exists; if not, create a new one
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({ email });
    }

    // Hash the OTP before saving
    admin.otp = await bcrypt.hash(otp, 10);
    admin.otpExpiresAt = otpExpiresAt;
    await admin.save();

    // Send the OTP via email
    await sendMail(
      email,
      "Admin OTP",
      `Your OTP is ${otp}. It is valid for ${OTP_EXPIRY_MINUTES} minutes.`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Verify OTP and login the admin
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if OTP exists and is still valid
    if (!admin.otp || !admin.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (new Date() > admin.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare input OTP with hashed one
    const isMatch = await bcrypt.compare(otp, admin.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark admin as verified and remove used OTP
    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiresAt = undefined;
    await admin.save();

    // Generate JWT access and refresh tokens
    const accessToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send access token in response
    res.json({ token: accessToken });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Generate a new access token using a valid refresh token
 */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    // Check if refresh token exists
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify and decode refresh token
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Find the admin by ID from the token
      const admin = await Admin.findById(decoded.id);
      if (!admin || !admin.isVerified) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Generate and return a new access token
      const newAccessToken = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      res.json({ token: newAccessToken });
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Logout the admin by clearing the refresh token cookie
 */
export const logout = (_req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
};
