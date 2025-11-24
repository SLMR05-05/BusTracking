import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteStops,
  addRouteStop,
  updateRouteStop,
  deleteRouteStop
} from "../../controllers/admin/RouteController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", createRoute);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);
router.get("/:id/stops", getRouteStops);
router.post("/:id/stops", addRouteStop);
router.put("/:id/stops/:stopId", updateRouteStop);
router.delete("/:id/stops/:stopId", deleteRouteStop);

export default router;
