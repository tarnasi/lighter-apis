import express, { Request, RequestHandler, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = "default".trim();
    const uploadPath = path.join("uploads", folderName);

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        cb(err, uploadPath);
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split(".")[1];
    cb(null, `${Date.now()}.${extension}`);
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

    const folderName = req.body?.folderName || "default";
    const filePath = `/uploads/${folderName}/${req.file.filename}`;
    res.json({ url: filePath });
  }
);

/**
 * POST /delete
 * Expects: { imagePath: "/uploads/default/filename.jpg" }
 */
uploadRouter.delete("/delete", (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }

  const imageDir = path.join(process.cwd(), "uploads", "default");
  const fullPath = path.join(imageDir, filename);

  // Extra security check to make sure the file is not outside uploads/default
  if (!fullPath.startsWith(imageDir)) {
    return res.status(400).json({ message: "Invalid file path" });
  }

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("File deletion error:", err);
      return res.status(500).json({ message: "Error deleting file" });
    }

    res.json({ message: "File deleted successfully" });
  });
});

export default uploadRouter;
