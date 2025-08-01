import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { sendMail } from "../utils/mailer.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_EXPIRY_MINUTES = 5;

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({ email });
    }

    admin.otp = await bcrypt.hash(otp, 10);
    admin.otpExpiresAt = otpExpiresAt;
    await admin.save();

    await sendMail(email, "Admin OTP", `Your OTP is ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (!admin.otp || !admin.otpExpiresAt)
      return res.status(400).json({ message: "No OTP found. Please request a new one." });

    if (new Date() > admin.otpExpiresAt)
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, admin.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiresAt = undefined;
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.json({ token });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_req, res) => {
  res.json({ message: "Logged out successfully" });
};
