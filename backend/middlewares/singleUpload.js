import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const ensureDir = (sub) => {
  const dir = `uploads/${sub}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

["about", "contact", "blogs"].forEach(ensureDir);

const storage = multer.memoryStorage();
const limits = { fileSize: 1 * 1024 * 1024 };

const fileFilter = (_req, file, cb) => {
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({ storage, limits, fileFilter }).single("image");

export const sharpResize = (folder) => async (req, res, next) => {
  try {
    if (req.file) {
      const filename = `${folder}-${Date.now()}.webp`;
      const filepath = path.join(`uploads/${folder}`, filename);

      await sharp(req.file.buffer)
        .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);

      req.body.imageUrl = `/uploads/${folder}/${filename}`;
    }
    next();
  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ message: "Image processing failed" });
  }
};
