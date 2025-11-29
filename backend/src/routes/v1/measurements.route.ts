import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import * as measurementsController from "../../controllers/measurements.controllers";
import validationMiddleware from "../../middlewares/validation.middleware";
import { MeasurementDto } from "../../dtos/measurement.dto";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

router.get("/", authMiddleware, measurementsController.getMeasurements);
router.post(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  validationMiddleware(MeasurementDto, "body"),
  measurementsController.createMeasurement
);

router.post(
  "/:id",
  authMiddleware,
  protectRoute(["admin"]),
  validationMiddleware(MeasurementDto, "body"),
  measurementsController.editMeasurement
);

router.delete(
  "/:id",
  authMiddleware,
  protectRoute(["admin"]),
  measurementsController.deleteMeasurement
);

export default router;
