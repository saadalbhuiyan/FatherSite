import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import { upload, sharpResize } from "../middlewares/singleUpload.js";
import {
  createAbout,
  getAdminAbout,
  updateAbout,
  deleteAbout,
  getPublicAbout
} from "../controllers/aboutController.js";

const router = express.Router();

/* ---------- ADMIN ---------- */
router.post("/", adminAuth, upload, sharpResize("about"), createAbout);
router.get("/admin", adminAuth, getAdminAbout);        // GET /api/about/admin
router.put("/admin", adminAuth, upload, sharpResize("about"), updateAbout);
router.delete("/admin", adminAuth, deleteAbout);

/* ---------- PUBLIC ---------- */
router.get("/", getPublicAbout);                       // GET /api/about

export default router;