import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getMessagesInRoom,
  getRoomsForSidebar,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/rooms", protectRoute, getRoomsForSidebar);
router.get("/:id", protectRoute, getMessages);
router.get("/room/:id", protectRoute, getMessagesInRoom);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
