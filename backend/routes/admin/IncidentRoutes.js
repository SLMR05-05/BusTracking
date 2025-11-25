import express from "express";
import {
  getAllIncidents,
  createIncident,
  deleteIncident
} from "../../controllers/admin/IncidentController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllIncidents);
router.post("/", createIncident);
router.delete("/:id", deleteIncident);

export default router;
