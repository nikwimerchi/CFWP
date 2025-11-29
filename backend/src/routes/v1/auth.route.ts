import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import { CreateUserDto, LoginDto } from "../../dtos/users.dto";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  logOut,
  logIn,
  signUp,
  verifyUserEmail,
} from "../../controllers/auth.controllers";

const router = Router();

router.post("/signup", validationMiddleware(CreateUserDto, "body"), signUp);
router.post("/login", validationMiddleware(LoginDto, "body"), logIn);
router.post("/logout", authMiddleware, logOut);
router.get("/verify/:verificationToken", verifyUserEmail);

export default router;
