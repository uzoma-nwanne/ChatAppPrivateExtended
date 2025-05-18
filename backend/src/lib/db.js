import mongoose from "mongoose";
import {logger} from "./logger.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to mongo db: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message} on DB connection`);
    console.log("MongoDB connection error " + error);
  }
};
