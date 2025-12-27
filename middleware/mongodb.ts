import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

// Global cache for serverless environments
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add a property to the global object in a type-safe way
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export const connectDb = async () => {
  if (!uri) throw new Error("Missing MongoDB URI in environment variables");
  if (!dbName) throw new Error("Missing DB_NAME in environment variables");

  // Agar connection pehle se hai, to reuse karo
  if (cached.conn) {
    return cached.conn;
  }

  // Agar abhi tak promise nahi bani, to naya connection banao
  if (!cached.promise) {
    const opts = {
      dbName: dbName,
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => mongoose);
  }

  try {
    // Promise ka result store karo taaki next call me reuse ho
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected!");
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};
