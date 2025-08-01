import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/blogs";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }
}).single("image");

export const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `blog-${Date.now()}.webp`;
    const filepath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    req.body.image = `/uploads/blogs/${filename}`;
    next();
  } catch (err) {
    console.error("Image processing failed:", err);
    res.status(500).json({ message: "Failed to process image" });
  }
};
