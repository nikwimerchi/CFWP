import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import * as parentsController from "../../controllers/parents.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

/**
 * Admin: View all registered parents
 * Logic: Fetches users with role 'parent', excluding passwords.
 */
router.get(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  parentsController.findAllParents
);

/**
 * Parent: View my own children
 * Logic: Uses the parent's UUID from the auth token to filter the children table.
 */
router.get(
  "/children",
  authMiddleware,
  protectRoute(["parent"]),
  parentsController.findMyChildren
);

export default router;