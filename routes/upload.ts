import express, { Request, RequestHandler, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = ("default").trim();
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
    const extension = file.originalname.split('.')[1]
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

export default uploadRouter;
