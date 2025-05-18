import mongoose from "mongoose";

const messageRoomSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {timestamps: true},
);

const MessagesInRoom = mongoose.model("Message-Room", messageRoomSchema);

export default MessagesInRoom;
