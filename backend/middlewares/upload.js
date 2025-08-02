import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// ===== Ensure Upload Directory Exists =====
const uploadDir = "uploads/blogs";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===== Multer Configuration =====
// Use memory storage to keep uploaded file in memory (buffer)
const storage = multer.memoryStorage();

// Only allow image files
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Limit file size to 1MB and export the upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
}).single("image");

// ===== Sharp Image Processing Middleware =====
// Resize and convert image, then store the path in req.body.image
export const processImage = async (req, res, next) => {
  // Skip processing if no image was uploaded
  if (!req.file) return next();

  try {
    // Create a unique filename
    const filename = `blog-${Date.now()}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Resize, convert to WebP, and save the file
    await sharp(req.file.buffer)
      .resize(1280, 720, {
        fit: "inside",           // Keep aspect ratio, fit within 1280x720
        withoutEnlargement: true // Don't enlarge small images
      })
      .webp({ quality: 80 })     // Convert to WebP format
      .toFile(filepath);

    // Save the file path in the request body to use in controller
    req.body.image = `/uploads/blogs/${filename}`;
    next();
  } catch (err) {
    console.error("Image processing failed:", err);
    res.status(500).json({ message: "Failed to process image" });
  }
};
