import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import {logger} from "../lib/logger.js";

export const createroom = async (req, res) => {
  const {name, description} = req.body;
  const userId = req.user._id;
  try {
    if (!name || !description) {
      return res.status(400).json({message: "All fields are required"});
    }

    if (!userId) {
      return res.status(400).json({message: "User is not authenticated"});
    }

    const room = await Room.findOne({name, createdBy: userId});
    if (room) return res.status(400).json({message: "Room already exists"});

    const newRoom = new Room({
      name,
      description,
      createdBy: userId,
    });
    const newRoomUser = {
      idUser: userId,
      role: "admin",
    };
    newRoom.users.push(newRoomUser);

    if (newRoom) {
      await newRoom.save();
      res.status(201).json({
        _id: newRoom._id,
        name: newRoom.name,
        description: newRoom.description,
        createdBy: newRoom.createdBy,
      });
    } else {
      res.status(400).json({message: "Invalid room data"});
    }
  } catch (error) {
    logger.error(`Error: ${error.message} for  create room  by userId ${userId}`);
    console.log("Error in signup controller", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const updateroomprofile = async (req, res) => {
  let roomId;
  try {
    const {profilePic} = req.body;
    roomId = req.params;

    if (!profilePic) {
      return res.status(400).json({message: "Profile pic is required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {profilePic: uploadResponse.secure_url},
      {new: true},
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    logger.error(`Error: ${error.message} for Room ${roomId} on update profile request`);
    // console.log("error in update profile:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

export const addUserToRoom = async (req, res) => {
  const {idRoom, idNewUser} = req.params;
  const idLinkingUser = req.user._id;
  let room;
  let newRoomUser;
  try {
    if (!idRoom || !idNewUser) {
      return res.status(400).json({message: "Room and new user id is required"});
    }
    room = await Room.findById(idRoom);
    if (!room) {
      return res.status(400).json({message: "There is an issue with the room"});
    }

    const linkingUser = room.users.find((user) => String(user.idUser) === String(idLinkingUser));

    if (!linkingUser || linkingUser.role !== "admin") {
      return res.status(400).json({message: "Only room admins can add users to the room"});
    }
    const existingUser = room.users.find((user) => String(user.idUser) === String(idNewUser));
    if (existingUser) {
      return res.status(400).json({message: "The user is already in the room"});
    }
    const user = await User.findById(idNewUser);
    if (!user) {
      return res.status(400).json({message: "The user does not exist"});
    }
    newRoomUser = {
      idUser: idNewUser,
      role: "member",
    };
    room.users.push(newRoomUser);
    await room.save();
    res.status(200).json({room: room, user: newRoomUser});
  } catch (error) {
    logger.error(`Error in adding new User: ${newRoomUser} to Room: ${room}`);
    console.log("Error in adding user to room " + error);
    res.status(500).json({message: "Internal server error"});
  }
};

export const changeUserRole = async (req, res) => {
  const {idRoom, idRoomUser} = req.params;
  const idLinkingUser = req.user._id;
  let room;
  let roomUser;
  try {
    if (!idRoom || !idRoomUser) {
      return res.status(400).json({message: "Room and room user id is required"});
    }
    room = await Room.findById(idRoom);
    if (!room) {
      return res.status(400).json({message: "Room not found."});
    }

    const linkingUser = room.users.find((user) => String(user.idUser) === String(idLinkingUser));

    if (!linkingUser || linkingUser.role !== "admin") {
      return res.status(400).json({message: "Only a room admin can change  user role"});
    }
    room.users = room.users.map((user) => {
      let roleChanged = false;
      if (String(user.idUser) === String(idRoomUser)) {
        if (user.role === "admin" && !roleChanged) {
          user.role = "member";
          roleChanged = true;
        }
        if (user.role === "member" && !roleChanged) {
          user.role = "admin";
          roleChanged = true;
        }
      }
      return user;
    });
    await room.save();
    roomUser = room.users.find((user) => String(user.idUser) === String(idRoomUser));
    res.status(200).json({room: room, user: roomUser});
  } catch (error) {
    logger.error(`Error in updating User role: ${roomUser} to Room: ${room}`);
    console.log("Error in changing user role in room " + error);
    res.status(500).json({message: "Internal server error"});
  }
};

export const removeUserFromRoom = async (req, res) => {
  const {idRoom, idRoomUser} = req.params;
  const idLinkingUser = req.user._id;
  let room;
  try {
    if (!idRoom || !idRoomUser) {
      return res.status(400).json({message: "Room and room user id is required"});
    }
    room = await Room.findById(idRoom);
    if (!room) {
      return res.status(400).json({message: "Room not found."});
    }

    const linkingUser = room.users.find((user) => String(user.idUser) === String(idLinkingUser));

    if (!linkingUser || linkingUser.role !== "admin") {
      return res.status(400).json({message: "Only a room admin can remove a user from the room"});
    }
    room.users = room.users.filter((user) => {
      return String(user.idUser) !== String(idRoomUser);
    });
    await room.save();
    res.status(200).json({room: room, message: `user with id ${idRoomUser} removed from room`});
  } catch (error) {
    logger.error(`Error in removing user from room IDUser :${idRoomUser} from Room: ${room}`);
    console.log("Error in removing user from room " + error);
    res.status(500).json({message: "Internal server error"});
  }
};
