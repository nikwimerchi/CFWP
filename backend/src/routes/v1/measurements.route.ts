import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import * as measurementsController from "../../controllers/measurements.controllers";
import validationMiddleware from "../../middlewares/validation.middleware";
import { MeasurementDto } from "../../dtos/measurement.dto";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

/**
 * Public/User: Get all health standards
 * Used to populate charts or reference tables in the UI.
 */
router.get("/", authMiddleware, measurementsController.getMeasurements);

/**
 * Admin: Add a new growth standard record
 * Logic: Must strictly follow the MeasurementDto to ensure data integrity.
 */
router.post(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  validationMiddleware(MeasurementDto, "body"),
  measurementsController.createMeasurement
);

/**
 * Admin: Edit an existing standard
 * Note: :id is the UUID of the measurement record.
 */
router.post(
  "/:id",
  authMiddleware,
  protectRoute(["admin"]),
  validationMiddleware(MeasurementDto, "body"),
  measurementsController.editMeasurement
);

/**
 * Admin: Delete a specific standard
 */
router.delete(
  "/:id",
  authMiddleware,
  protectRoute(["admin"]),
  measurementsController.deleteMeasurement
);

export default router;