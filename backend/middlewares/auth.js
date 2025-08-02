import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Middleware to authenticate admin users using JWT
 */
export const adminAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1];

    // If token is missing, block the request
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token and extract admin ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin by ID and check if verified
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isVerified) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach admin info to request object and continue
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
