import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import { upload, sharpResize } from "../middlewares/singleUpload.js";
import {
  createContact,
  getAdminContact,
  updateContact,
  deleteContact,
  getPublicContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getPublicContact);
router.post("/", adminAuth, upload, sharpResize("contact"), createContact);
router.get("/admin", adminAuth, getAdminContact);
router.put("/", adminAuth, upload, sharpResize("contact"), updateContact);
router.delete("/", adminAuth, deleteContact);

export default router;
