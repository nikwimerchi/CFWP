import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import * as healthDataController from "../../controllers/childHealthData";
import { protectRoute } from "../../middlewares/protectRoute.middleware";
import { ChildHealthDataDto } from "../../dtos/healthData.dto";

const router = Router();

router.post(
  "/",
  authMiddleware,
  protectRoute(["advisor"]),
  validationMiddleware(ChildHealthDataDto, "body"),
  healthDataController.registerHealthData
);

router.get("/:id", authMiddleware, healthDataController.getHealthData);

export default router;
