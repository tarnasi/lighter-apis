import express, { Request, RequestHandler, Response } from "express";
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

uploadRouter.post(
  "/",
  upload.single("image-data") as RequestHandler,
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.json({ url: filePath });
  }
);

export default uploadRouter;
