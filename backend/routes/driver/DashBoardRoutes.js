import express from "express";
import {
  getDriverInfo,
  getSchedules,
  getScheduleDetail,
  getStops,
  getStudents,
  getAttendance,
  updateAttendance,
  getBusLocation,
  getSummary
} from "../../controllers/driver/DashBoardController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Tất cả routes cần xác thực token
router.use(verifyToken);

// Test endpoint - kiểm tra token
router.get("/test", (req, res) => {
  res.json({
    message: "Token hợp lệ",
    userId: req.user.userId,
    roleId: req.user.roleId,
    role: req.user.role
  });
});

// 1. Lấy thông tin tài xế hiện tại
router.get("/info", getDriverInfo);

// 2. Lấy danh sách lịch chạy (có thể lọc theo ngày)
// ?date=2025-11-19
router.get("/schedules", getSchedules);

// 3. Lấy chi tiết 1 lịch chạy
router.get("/schedules/:scheduleId", getScheduleDetail);

// 4. Lấy danh sách điểm dừng của 1 lịch
router.get("/schedules/:scheduleId/stops", getStops);

// 5. Lấy danh sách học sinh của 1 lịch
router.get("/schedules/:scheduleId/students", getStudents);

// 6. Lấy trạng thái điểm danh của 1 lịch
router.get("/schedules/:scheduleId/attendance", getAttendance);

// 7. Cập nhật điểm danh 1 học sinh
// POST body: { "status": "1" }
router.post("/schedules/:scheduleId/students/:studentId/attendance", updateAttendance);

// 8. Lấy vị trí xe
router.get("/bus/:busId/location", getBusLocation);

// 9. Lấy tóm tắt dashboard
router.get("/schedules/:scheduleId/summary", getSummary);

export default router;