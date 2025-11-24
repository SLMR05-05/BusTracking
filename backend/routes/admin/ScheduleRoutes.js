import express from "express";
import {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByDate,
  getScheduleDetails,
  addScheduleDetail,
  updateStopStatus,
  deleteScheduleDetails,
  createAttendanceForSchedule
} from "../../controllers/admin/ScheduleController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Routes cụ thể phải đặt trước routes có tham số động
router.get("/", getAllSchedules);
router.get("/by-date", getSchedulesByDate);
router.post("/", createSchedule);

// Routes với :id/subpath
router.get("/:id/details", getScheduleDetails);
router.post("/:id/details", addScheduleDetail);
router.delete("/:id/details", deleteScheduleDetails);
router.post("/:id/attendance", createAttendanceForSchedule);

// Routes với :id
router.get("/:id", getScheduleById);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

// Routes khác
router.put("/details/:detailId/status", updateStopStatus);

export default router;