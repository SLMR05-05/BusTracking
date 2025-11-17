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
  updateStopStatus
} from "../controllers/ScheduleController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllSchedules);
router.get("/by-date", getSchedulesByDate);
router.get("/:id", getScheduleById);
router.post("/", createSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);
router.get("/:id/details", getScheduleDetails);
router.post("/:id/details", addScheduleDetail);
router.put("/details/:detailId/status", updateStopStatus);

export default router;