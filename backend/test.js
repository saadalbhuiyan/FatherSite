import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 6000;

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueName = `upload-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("image");

// Sharp-based compression middleware
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  const fullPath = path.join(uploadDir, req.file.filename);
  const ext = path.extname(req.file.filename).toLowerCase();

  try {
    const image = sharp(fullPath);

    // Resize to original size, only compressing
    if (ext === ".jpg" || ext === ".jpeg") {
      await image.jpeg({ quality: 80 }).toFile(fullPath);
    } else if (ext === ".png") {
      await image.png({ quality: 80 }).toFile(fullPath);
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Image compression failed" });
  }
};

app.post("/upload", upload, compressImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    message: "Image uploaded and compressed successfully!",
    imageUrl: filePath,
  });
});

app.use("/uploads", express.static(path.resolve(uploadDir)));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
