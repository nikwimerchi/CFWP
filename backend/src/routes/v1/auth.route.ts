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

/**
 * Public: Register a new account
 * Logic: Hashes password and generates a verificationToken in the service layer.
 */
router.post(
  "/signup", 
  validationMiddleware(CreateUserDto, "body"), 
  signUp
);

/**
 * Public: Authenticate user
 * Logic: Queries Supabase for email, compares bcrypt hash, and returns JWT + Cookie.
 */
router.post(
  "/login", 
  validationMiddleware(LoginDto, "body"), 
  logIn
);

/**
 * Private: Terminate session
 * Logic: Clears the client-side cookie/token.
 */
router.post(
  "/logout", 
  authMiddleware, 
  logOut
);

/**
 * Public: Email Verification
 * Parameter :verificationToken is a secure hex string generated during signup.
 */
router.get(
  "/verify/:verificationToken", 
  verifyUserEmail
);

export default router;