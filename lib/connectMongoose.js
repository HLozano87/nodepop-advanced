import mongoose from "mongoose";

export default function connectMongoose() {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then((mongoose) => mongoose.connection);
}
