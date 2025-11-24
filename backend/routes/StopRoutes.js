import express from "express";
import { 
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop
} from "../controllers/StopController.js";

const router = express.Router();

router.get("/", getAllStops);
router.get("/:id", getStopById);
router.post("/", createStop);
router.put("/:id", updateStop);
router.delete("/:id", deleteStop);

export default router;
