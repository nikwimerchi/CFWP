import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import * as parentsController from "../../controllers/parents.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  parentsController.findAllParents
);

router.get(
  "/children",
  authMiddleware,
  protectRoute(["parent"]),
  parentsController.findMyChildren
);

export default router;
