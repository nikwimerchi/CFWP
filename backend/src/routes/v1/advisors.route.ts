import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import { CreateAdvisorDto } from "../../dtos/users.dto";
import authMiddleware from "../../middlewares/auth.middleware";
import * as advisorsController from "../../controllers/advisors.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

/**
 * Admin: Register a new Health Advisor
 * Triggered by: Admin Dashboard
 */
router.post(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  validationMiddleware(CreateAdvisorDto, "body"),
  advisorsController.registerAdvisor
);

/**
 * Admin: Approve an advisor's account
 * Parameter :id is now a UUID string
 */
router.post(
  "/approve/:id",
  authMiddleware,
  protectRoute(["admin"]),
  advisorsController.approveAdvisor
);

/**
 * Admin: Reject/Deactivate an advisor
 */
router.post(
  "/reject/:id",
  authMiddleware,
  protectRoute(["admin"]),
  advisorsController.rejectAdvisor
);

/**
 * Admin: View all registered advisors
 */
router.get(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  advisorsController.findAllAdvisors
);

/**
 * Advisor: View children within their specific jurisdiction
 * Jurisdiction logic is handled in user.service.ts via JSONB address matching
 */
router.get(
  "/children",
  authMiddleware,
  protectRoute(["advisor"]),
  advisorsController.findAdvisorChildren
);

/**
 * Advisor: View parents within their specific jurisdiction
 */
router.get(
  "/parents",
  authMiddleware,
  protectRoute(["advisor"]),
  advisorsController.findAdvisorParent
);

export default router;