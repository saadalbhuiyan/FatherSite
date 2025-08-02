import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// ===== Ensure Upload Directories Exist =====
// This function checks and creates the necessary folders under "uploads/"
const ensureDir = (subfolder) => {
  const dir = `uploads/${subfolder}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create folders for specific use cases
["about", "contact", "blogs"].forEach(ensureDir);

// ===== Multer Setup =====
// Store uploaded files in memory (buffer)
const storage = multer.memoryStorage();

// Limit file size to 1MB
const limits = { fileSize: 1 * 1024 * 1024 };

// Only allow image files
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Exported multer middleware for handling single image uploads
export const upload = multer({ storage, limits, fileFilter }).single("image");

// ===== Sharp Resize Middleware =====
// Resize and convert image to WebP, then save it to the correct folder
export const sharpResize = (folder) => async (req, res, next) => {
  try {
    if (req.file) {
      // Generate unique filename
      const filename = `${folder}-${Date.now()}.webp`;
      const filepath = path.join(`uploads/${folder}`, filename);

      // Resize and convert the image
      await sharp(req.file.buffer)
        .resize(1280, 720, {
          fit: "inside", // Resize to fit within 1280x720 without cropping
          withoutEnlargement: true, // Do not enlarge small images
        })
        .webp({ quality: 80 }) // Convert to WebP format with good quality
        .toFile(filepath);

      // Attach the image URL to the request body for later use
      req.body.imageUrl = `/uploads/${folder}/${filename}`;
    }

    next(); // Proceed to next middleware or route
  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ message: "Image processing failed" });
  }
};
