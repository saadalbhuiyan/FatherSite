import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { resolve } from "path";
import { connectDB } from "./config/db.js";

import adminAuthRoutes from "./routes/adminAuth.js";
import blogRoutes from "./routes/blog.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Load env vars
config({ path: resolve(".env") });

const app = express();

// Connect to MongoDB
connectDB();

// ===== Middlewares =====
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend domain
  credentials: true,
}));
app.use(express.json());

// Static
app.use("/uploads", express.static(resolve("uploads")));

// ===== Routes =====
// Admin (auth + protected)
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/blogs", blogRoutes);
app.use("/api/admin/about", aboutRoutes);
app.use("/api/admin/contact", contactRoutes);

// Public
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: "Server error" });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
