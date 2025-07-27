// server.js – clean version
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { resolve } from "path";
import { connectDB } from "./config/db.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import blogRoutes from "./routes/blog.js";
import aboutRoutes from "./routes/about.js";
import contactRoutes from "./routes/contact.js";

config({ path: resolve(".env") });

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Admin-only
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/blogs", blogRoutes);
app.use("/api/admin/about", aboutRoutes);
app.use("/api/admin/contact", contactRoutes);

// Public
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));