import winston from "winston";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

dotenv.config({path: `.env.${process.env.NODE_ENV}`});
const {combine, timestamp, json, errors} = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({stack: true}),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "/combined.log"),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "/app-error.log"),
      level: "error",
    }),
  ],
  exceptionHandlers: [new winston.transports.File({filename: path.join(logDir, "/exception.log")})],
  rejectionHandlers: [
    new winston.transports.File({filename: path.join(logDir, "/rejections.log")}),
  ],
});
