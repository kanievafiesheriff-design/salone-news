import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryClient.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
});

router.post(
  "/image",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file",
      });
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "salone-news",
            resource_type: "image",
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        );

        stream.end(req.file.buffer);
      });

      return res.status(201).json({
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error.message);
      return res.status(502).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

export default router;
