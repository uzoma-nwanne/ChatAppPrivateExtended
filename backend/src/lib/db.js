import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to mongo db: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error")
    }
}