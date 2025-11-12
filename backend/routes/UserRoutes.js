import express from "express";
import { login,logout,getCurrentUser } from "../controllers/UserController.js";
import { verifyToken  } from "../Middleware/authMiddleware.js"; 
const router = express.Router();
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getCurrentUser);
export default router;
