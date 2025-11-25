import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { createStopPassedNotification } from "../../services/notificationService.js";

const router = express.Router();

// Gửi thông báo khi xe qua trạm
router.post("/stop-passed", verifyToken, (req, res) => {
  const { scheduleId, stopId } = req.body;
  
  if (!scheduleId || !stopId) {
    return res.status(400).json({ message: "Thiếu thông tin scheduleId hoặc stopId" });
  }
  
  createStopPassedNotification(scheduleId, stopId, (err, notifications) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi tạo thông báo", error: err.message });
    }
    
    res.json({
      message: "Đã gửi thông báo",
      count: notifications.length,
      notifications
    });
  });
});

export default router;
