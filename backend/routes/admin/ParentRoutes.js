import express from "express";
import {
  getAllParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
  getParentChildren
} from "../../controllers/admin/ParentController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllParents);
router.get("/:id", getParentById);
router.post("/", createParent);
router.put("/:id", updateParent);
router.delete("/:id", deleteParent);
router.get("/:id/children", getParentChildren);

export default router;
