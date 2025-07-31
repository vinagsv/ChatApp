import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDb connected, DB Host: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
