import express from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import { RegisterChildDto } from "../../dtos/child.dto";
import * as childController from "../../controllers/child.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

const router = express.Router();

/**
 * Register a new child
 * Allowed: Advisor (on behalf of parent) or Parent
 */
router.post(
  "/",
  authMiddleware,
  protectRoute(["advisor", "parent"]),
  validationMiddleware(RegisterChildDto, "body"),
  childController.registerChild
);

/**
 * Approve a child's registration
 * Allowed: Advisor only
 */
router.put(
  "/approve/:id",
  authMiddleware,
  protectRoute(["advisor"]),
  childController.approveChild
);

/**
 * Reject/Archive a child's registration
 * Allowed: Advisor only
 */
router.put(
  "/reject/:id",
  authMiddleware,
  protectRoute(["advisor"]),
  childController.rejectChild
);

/**
 * Delete a child record
 * Allowed: Parent only
 */
router.delete(
  "/:id",
  authMiddleware,
  protectRoute(["parent"]),
  childController.deleteChild
);

/**
 * Edit child information
 * Allowed: Parent or Admin
 */
router.put(
  "/:id",
  authMiddleware,
  protectRoute(["parent", "admin"]),
  validationMiddleware(RegisterChildDto, "body"),
  childController.editChild
);

/**
 * Find all children (Admin Dashboard)
 * Supports pagination and filtering via Query Params
 */
router.get(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  childController.findAllChildren
);

/**
 * Get detailed info for a single child
 * Allowed: Authenticated users (Ownership checked in controller/service)
 */
router.get("/:id", authMiddleware, childController.findSingleChild);

export default router;