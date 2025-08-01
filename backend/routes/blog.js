import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogById
} from "../controllers/blogController.js";
import { adminAuth } from "../middlewares/auth.js";
import { upload, processImage } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", adminAuth, upload, processImage, createBlog);
router.put("/:id", adminAuth, upload, processImage, updateBlog);
router.delete("/:id", adminAuth, deleteBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);

export default router;
