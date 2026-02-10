import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import * as healthDataController from "../../controllers/childHealthData";
import { protectRoute } from "../../middlewares/protectRoute.middleware";
import { ChildHealthDataDto } from "../../dtos/healthData.dto";

const router = Router();

/**
 * Advisor: Register Monthly Health Data
 * Logic: Compares input against the 'measurements' table in Supabase 
 * to determine if the child is in a 'red', 'yellow', or 'green' condition.
 */
router.post(
  "/",
  authMiddleware,
  protectRoute(["advisor"]),
  validationMiddleware(ChildHealthDataDto, "body"),
  healthDataController.registerHealthData
);

/**
 * Parent/Advisor/Admin: Get Child Health History
 * Parameter :id represents the childId (UUID).
 * Query Params: ?year=2024
 */
router.get(
  "/:id", 
  authMiddleware, 
  healthDataController.getHealthData
);

export default router;