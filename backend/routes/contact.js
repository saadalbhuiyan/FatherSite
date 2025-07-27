import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import { upload, sharpResize } from "../middlewares/singleUpload.js";
import {
  createContact,
  getAdminContact,
  updateContact,
  deleteContact,
  getPublicContact
} from "../controllers/contactController.js";

const router = express.Router();

/* ---------- ADMIN ---------- */
router.post("/", adminAuth, upload, sharpResize("contact"), createContact);
router.get("/admin", adminAuth, getAdminContact);        // GET /api/contact/admin
router.put("/admin", adminAuth, upload, sharpResize("contact"), updateContact);
router.delete("/admin", adminAuth, deleteContact);

/* ---------- PUBLIC ---------- */
router.get("/", getPublicContact);                       // GET /api/contact

export default router;