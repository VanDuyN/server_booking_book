import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.mjs";
import { createValidator } from "../middlewares/validator.mjs";
import { userController } from "../controllers/user.controller.mjs";
import { authController } from "../controllers/auth.controller.mjs";
import { limiter } from "../config/security.mjs";

const router = Router();

// ===== Auth Routes =====
router.post(
  "/api/register",
  limiter,
  createValidator('createUser'),
  authController.register
);

router.post(
  "/api/login",
  limiter,
  createValidator('login'),
  authController.login
);

router.get(
  "/api/auth/status", 
  authenticateToken,
  authController.checkStatus
);

// ===== User Routes =====
router.get(
  "/api/users",
  authenticateToken,
  userController.getAllUsers
);

router.get(
  "/api/users/:id",
  authenticateToken,
  userController.getUserById
);

router.put(
  "/api/users/:id",
  authenticateToken,
  createValidator('updateUser'),
  userController.updateUser
);

router.delete(
  "/api/users/:id",
  authenticateToken,
  userController.deleteUser
);

export default router;