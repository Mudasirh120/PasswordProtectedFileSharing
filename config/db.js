import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully => ", res.connection.host);
  } catch (error) {
    console.log("MongoDB connection failed => ", error);
    process.exit(1);
  }
};
