import express from "express";
import {
  getAllParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
  getParentChildren,
  getCurrentParent,
  getCurrentParentStudents
} from "../../controllers/admin/ParentController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Debug middleware
router.use((req, res, next) => {
  console.log(`[ParentRoutes] ${req.method} ${req.path}`);
  console.log(`[ParentRoutes] User:`, req.user);
  next();
});

// Routes cụ thể phải đặt trước routes có tham số động
router.get("/me/students", (req, res, next) => {
  console.log('[ParentRoutes] Calling getCurrentParentStudents');
  getCurrentParentStudents(req, res, next);
});
router.get("/me", (req, res, next) => {
  console.log('[ParentRoutes] Calling getCurrentParent');
  getCurrentParent(req, res, next);
});
router.get("/", getAllParents);
router.post("/", createParent);
router.get("/:id/students", getParentChildren);
router.get("/:id", getParentById);
router.put("/:id", updateParent);
router.delete("/:id", deleteParent);

export default router;
