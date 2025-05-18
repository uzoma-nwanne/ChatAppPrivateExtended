import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import {getReceiverSocketId, io} from "../lib/socket.js";
import {logger} from "../lib/logger.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    logger.error(`Error: ${error.message} for user ${req.user.email} on getting users`);
    //console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};

export const getRoomsForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredRooms = await Room.find({"users.idUser": loggedInUserId});
    res.status(200).json(filteredRooms);
  } catch (error) {
    logger.error(`Error: ${error.message} for user ${req.user.email} on getting rooms`);
    console.error("Error in getUserRooms: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};

export const getMessages = async (req, res) => {
  try {
    const {id: userToChatId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId},
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    logger.error(`Error: ${error.message} for user ${req.user.email} on Get Message controller`);
    // console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};

export const getMessagesInRoom = async (req, res) => {
  try {
    const {id: roomId} = req.params;
    const messages = await Message.find({
      receiverId: roomId,
    });
    res.status(200).json(messages);
  } catch (error) {
    logger.error(
      `Error: ${error.message} for get messages for Room ${req.params.id} on Get Message controller`,
    );
    // console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};

export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    logger.error(
      `Error: ${error.message} for user ${req.user.email} on sending messages controller`,
    );
    // console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};
