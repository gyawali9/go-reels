import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!;

if (!MONGO_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDb() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferComands: true,
      maxPoolSize: 10,
    };
    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
