import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const dir = (sub) => `uploads/${sub}`;
[dir("about"), dir("contact")].forEach((d) =>
  fs.existsSync(d) || fs.mkdirSync(d, { recursive: true })
);

const storage = multer.memoryStorage();
const limits = { fileSize: 1 * 1024 * 1024 };
const fileFilter = (_req, file, cb) =>
  file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only images"), false);

export const upload = multer({ storage, limits, fileFilter }).single("image");

export const sharpResize = (folder) => async (req, res, next) => {
  if (req.file) {
    const filename = `${folder}-${Date.now()}.webp`;
    const filepath = path.join(`uploads/${folder}`, filename);
    await sharp(req.file.buffer)
      .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);
    req.body.imageUrl = `/uploads/${folder}/${filename}`;
  }
  next();   // allow partial update (no file → no imageUrl change)
};