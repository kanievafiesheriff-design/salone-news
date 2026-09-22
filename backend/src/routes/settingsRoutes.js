import express from "express";
import { getSettings, updateSetting } from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, updateSetting);

export default router;
