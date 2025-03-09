import express from "express";
import {config} from "dotenv";
import authRoute from "./routes/auth.route.js"
import bodyParser from "body-parser";
import { connectDB } from "./lib/db.js";

config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json())
app.use("/api/auth", authRoute);

app.listen(PORT, ()=>{
    console.log('Listening on port:' + PORT );
    connectDB();
})