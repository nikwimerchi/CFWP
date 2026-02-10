import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import * as notificationsControllers from "../../controllers/notifications.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";

const router = Router();

/**
 * Admin: Broadcast a notification
 * Logic: Inserts records into the 'notifications' table for targeted users.
 */
router.post(
  "/",
  authMiddleware,
  protectRoute(["admin"]),
  notificationsControllers.notifyPeople
);

/**
 * User: Get personal notifications
 * Fetches notifications where userId matches req.user.id.
 */
router.get("/", authMiddleware, notificationsControllers.getNotifications);

/**
 * User: Mark all notifications as read
 * Note: Positioned before /:id to prevent "read" being treated as a UUID parameter.
 */
router.get(
  "/read",
  authMiddleware,
  notificationsControllers.readAllNotifications
);

/**
 * User: Delete a specific notification
 * Parameter :id is the UUID of the notification record.
 */
router.delete(
  "/:id",
  authMiddleware,
  notificationsControllers.deleteNotification
);

export default router;