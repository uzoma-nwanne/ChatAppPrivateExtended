import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import {connectDB} from "./lib/db.js";
import {logger} from "./lib/logger.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import roomRoutes from "./routes/room.route.js";
import {app, server} from "./lib/socket.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const PORT = process.env.PORT;
const __dirname = path.resolve();

const morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message) => logger.http(message.trim()),
  },
});
app.use(morganMiddleware);

app.use(express.json({limit: "50mb"})); //increase limit to avoid pYload size error when uploading files
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/room", roomRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
