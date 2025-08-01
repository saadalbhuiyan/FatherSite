import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import { upload, sharpResize } from "../middlewares/singleUpload.js";
import {
  createAbout,
  getAdminAbout,
  updateAbout,
  deleteAbout,
  getPublicAbout
} from "../models/aboutController.js";

const router = express.Router();

router.get("/", getPublicAbout);
router.post("/", adminAuth, upload, sharpResize("about"), createAbout);
router.get("/", adminAuth, getAdminAbout);
router.put("/", adminAuth, upload, sharpResize("about"), updateAbout);
router.delete("/", adminAuth, deleteAbout);

export default router;
