import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBConnection);
    console.log("DB connection established successfully");
  } catch (error) {
    console.error("DB connection failed");
    throw error;
  }
};

export default connectDB;
