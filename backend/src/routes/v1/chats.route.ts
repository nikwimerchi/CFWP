import express from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as chatControllers from "../../controllers/chat.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import { ChatDto } from "../../dtos/chat.dto";

const router = express.Router();

/**
 * Parent: Send a message to the AI Health Assistant
 * The service will now verify child ownership via Supabase UUIDs.
 */
router.post(
  "/",
  authMiddleware,
  protectRoute(["parent"]),
  validationMiddleware(ChatDto, "body"),
  chatControllers.chat
);

/**
 * Parent: Get chat history for a specific child
 * Note: :id should be the childId (UUID format).
 */
router.get(
  "/:id",
  authMiddleware,
  protectRoute(["parent"]),
  chatControllers.getChats
);

export default router;