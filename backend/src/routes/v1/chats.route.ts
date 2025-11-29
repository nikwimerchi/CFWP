import express from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as chatControllers from "../../controllers/chat.controllers";
import { protectRoute } from "../../middlewares/protectRoute.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import { ChatDto } from "../../dtos/chat.dto";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  protectRoute(["parent"]),
  validationMiddleware(ChatDto, "body"),
  chatControllers.chat
);

router.get(
  "/:id",
  authMiddleware,
  protectRoute(["parent"]),
  chatControllers.getChats
);

export default router;
