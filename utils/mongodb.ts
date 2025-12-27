import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  // Prevent multiple connections
  if (mongoose.connection.readyState === 1) {
    console.log("📌 MongoDB already connected (readyState)");
    return;
  }

  if (isConnected) {
    console.log("📌 MongoDB already connected (cache)");
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME,   // pass separately (recommended)
    });

    isConnected = true;
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
