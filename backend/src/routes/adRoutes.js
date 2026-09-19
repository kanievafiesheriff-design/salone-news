import express from "express";
import {
  getAds,
  createAd,
  updateAd,
  deleteAd,
  trackAdEvent,
} from "../controllers/adController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get active ads
router.get("/", getAds);

// Public: Track ad events (clicks/impressions)
router.put("/track/:id", trackAdEvent);

// Admin: Create, Update, Delete ads
router.post("/", protect, adminOnly, createAd);
router.put("/:id", protect, adminOnly, updateAd);
router.delete("/:id", protect, adminOnly, deleteAd);

export default router;
