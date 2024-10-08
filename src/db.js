import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(">>> Base De Datos Conectada");
  } catch (error) {
    console.log(error);
  }
};
