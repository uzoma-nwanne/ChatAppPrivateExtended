import express from "express";
import {
  addUserToRoom,
  changeUserRole,
  createroom,
  removeUserFromRoom,
} from "../controllers/room.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express();

router.post("/createroom", protectRoute, createroom);
router.patch("/addUser/:idRoom/:idNewUser", protectRoute, addUserToRoom);
router.patch("/updateUser/:idRoom/:idRoomUser", protectRoute, changeUserRole);
router.patch("/removeUser/:idRoom/:idRoomUser", protectRoute, removeUserFromRoom);

export default router;
