import express from "express";
import multer from "multer";

const uploadRouter = express.Router();

// Configure multer for local uploads (you can later swap with S3/Cloudinary)
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
});

export default uploadRouter;
