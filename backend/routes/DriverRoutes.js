import express from "express";
import {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverSchedule
} from "../controllers/DriverController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tất cả route cần đăng nhập
router.use(verifyToken);

router.get("/", getAllDrivers);
router.get("/:id", getDriverById);
router.post("/", createDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);
router.get("/:id/schedule", getDriverSchedule);

export default router;
