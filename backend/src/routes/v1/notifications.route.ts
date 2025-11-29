import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import * as notificationsControllers from "../../controllers/notifications.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  notificationsControllers.notifyPeople
);

router.get("/", authMiddleware, notificationsControllers.getNotifications);
router.delete(
  "/:id",
  authMiddleware,
  notificationsControllers.deleteNotification
);

router.get(
  "/read",
  authMiddleware,
  notificationsControllers.readAllNotifications
);

export default router;
