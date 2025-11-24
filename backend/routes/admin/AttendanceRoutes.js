import express from "express";
import {
  getAttendanceBySchedule,
  createAttendance,
  updateAttendanceStatus,
  getStudentAttendanceHistory
} from "../../controllers/admin/AttendanceController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/schedule/:scheduleId", getAttendanceBySchedule);
router.post("/", createAttendance);
router.put("/:id/status", updateAttendanceStatus);
router.get("/student/:studentId/history", getStudentAttendanceHistory);

export default router;
