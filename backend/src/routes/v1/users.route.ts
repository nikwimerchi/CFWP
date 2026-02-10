import express, { Router } from "express";
import * as controller from "../../controllers/users.controllers";
import validationMiddleware from "../../middlewares/validation.middleware";
import { ChangePasswordDto, EditUserDto } from "../../dtos/users.dto";
import authMiddleware from "../../middlewares/auth.middleware";

const router: Router = express.Router();

/**
 * Update User Password
 * Logic: Compares current hash and updates with new hashed password in Supabase.
 */
router.put(
  "/updatePassword",
  authMiddleware,
  validationMiddleware(ChangePasswordDto, "body"),
  controller.changePassword
);

/**
 * Edit User Profile
 * Logic: Updates general information (names, phoneNumber, address JSONB).
 */
router.put(
  "/",
  authMiddleware,
  validationMiddleware(EditUserDto, "body"),
  controller.editUser
);

export default router;