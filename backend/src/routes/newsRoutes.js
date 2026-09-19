
import express from "express";

import {
  getNews,
  getAdminNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getBreakingNews,
  updateBreakingNews,
  getFeaturedAd,
} from "../controllers/newsController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
  PUBLIC
*/

// Get all news
router.get("/", getNews);

// Get breaking news
router.get("/breaking", getBreakingNews);

// Get featured ad
router.get("/featured-ad", getFeaturedAd);

// Get all articles, including drafts, for the admin dashboard
router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminNews
);

// Get article by slug
router.get("/slug/:slug", getNewsBySlug);

// Get article by ID
router.get("/:id", getNewsById);

/*
  ADMIN / EDITOR
*/

// Create article
router.post(
  "/",
  protect,
  adminOnly,
  createNews
);

// Update article
router.put(
  "/:id",
  protect,
  adminOnly,
  updateNews
);

// Delete article
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteNews
);

// Update breaking news
router.post(
  "/breaking",
  protect,
  adminOnly,
  updateBreakingNews
);

export default router;
