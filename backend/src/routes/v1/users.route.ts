import express, { Router } from "express";
import * as controller from "../../controllers/users.controllers";
import validationMiddleware from "../../middlewares/validation.middleware";
import { ChangePasswordDto, EditUserDto } from "../../dtos/users.dto";
import authMiddleware from "../../middlewares/auth.middleware";

const router: Router = express.Router();

// router.get("/", authMiddleware, controller.getUsers);

router.put(
  "/updatePassword",
  authMiddleware,
  validationMiddleware(ChangePasswordDto, "body"),
  controller.changePassword
);
router.put(
  "/",
  authMiddleware,
  validationMiddleware(EditUserDto, "body"),
  controller.editUser
);
export default router;
