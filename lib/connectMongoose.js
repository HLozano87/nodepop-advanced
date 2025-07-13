import mongoose from "mongoose";

export default async function connectMongoose() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    return conn.connection;
  } catch (error) {
    console.error("Error in connection to MongoDB", error)
    process.exit(1)
  }
}