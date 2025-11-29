import express from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import { RegisterChildDto } from "../../dtos/child.dto";
import * as childController from "../../controllers/child.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  protectRoute(["advisor", "parent"]),
  validationMiddleware(RegisterChildDto, "body"),
  childController.registerChild
);

router.put(
  "/approve/:id",
  authMiddleware,
  protectRoute(["advisor"]),
  childController.approveChild
);

router.put(
  "/reject/:id",
  authMiddleware,
  protectRoute(["advisor"]),
  childController.rejectChild
);

router.delete(
  "/:id",
  authMiddleware,
  protectRoute(["parent"]),
  childController.deleteChild
);
router.put(
  "/:id",
  authMiddleware,
  protectRoute(["parent", "admin"]),
  validationMiddleware(RegisterChildDto, "body"),
  childController.editChild
);

router.get(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  childController.findAllChildren
);

router.get("/:id", authMiddleware, childController.findSingleChild);

export default router;
