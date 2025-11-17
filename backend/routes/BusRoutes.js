import express from "express";
import {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusLocation,
  updateBusLocation
} from "../controllers/BusController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllBuses);
router.get("/:id", getBusById);
router.post("/", createBus);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);
router.get("/:id/location", getBusLocation);
router.post("/:id/location", updateBusLocation);

export default router;
