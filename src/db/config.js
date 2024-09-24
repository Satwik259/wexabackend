import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

import dotenv from "dotenv"

dotenv.config()

const MONGO_URI =  process.env.MONGODB_URI

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};
const disconnectDB = async () => {
  mongoose.connection.close();
};
export { connectDB, disconnectDB };
