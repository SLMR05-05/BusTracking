import express from "express";
import {
  getNotificationsByParent,
  createNotification,
  deleteNotification
} from "../controllers/NotificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/parent/:parentId", getNotificationsByParent);
router.post("/", createNotification);
router.delete("/:id", deleteNotification);

export default router;
