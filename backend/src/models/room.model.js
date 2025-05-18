import mongoose from "mongoose";

const roomUserSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: String,
  },
  {timestamps: true},
);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    createdBy: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    users: [roomUserSchema],
  },
  {timestamps: true},
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
