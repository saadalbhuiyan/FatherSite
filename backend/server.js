import express from "express";
import cors from "cors";
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

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(resolve("uploads")));

// Admin routes (protected)
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/blogs", blogRoutes);
app.use("/api/admin/about", aboutRoutes);
app.use("/api/admin/contact", contactRoutes);

// Public routes
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: "Server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
