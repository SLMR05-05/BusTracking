import express from "express";
import {
  getAllIncidents,
  createIncident,
  deleteIncident,
  notifyParentsAboutIncident
} from "../../controllers/admin/IncidentController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllIncidents);
router.post("/", createIncident);
router.post("/:id/notify-parents", notifyParentsAboutIncident);
router.delete("/:id", deleteIncident);

export default router;
