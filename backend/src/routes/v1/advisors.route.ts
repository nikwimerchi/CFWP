import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import { CreateAdvisorDto } from "../../dtos/users.dto";
import authMiddleware from "../../middlewares/auth.middleware";
import * as advisorsController from "../../controllers/advisors.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  validationMiddleware(CreateAdvisorDto, "body"),
  advisorsController.registerAdvisor
);

router.post(
  "/approve/:id",
  authMiddleware,
  protectRoute(["admin"]),
  advisorsController.approveAdvisor
);

router.post(
  "/reject/:id",
  authMiddleware,
  protectRoute(["admin"]),
  advisorsController.rejectAdvisor
);

router.get(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  advisorsController.findAllAdvisors
);

router.get(
  "/children",
  authMiddleware,
  protectRoute(["advisor"]),
  advisorsController.findAdvisorChildren
);

router.get(
  "/parents",
  authMiddleware,
  protectRoute(["advisor"]),
  advisorsController.findAdvisorParent
);

export default router;
