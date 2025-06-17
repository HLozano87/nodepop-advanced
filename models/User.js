import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { createTransport, sendEmail, generatePreviewURL } from "../lib/emailManager.js";

const userSchema = new Schema({
  // TODO name user and implement front for using with sendEmail
  name: {type: String},
  email: { type: String, unique: true },
  password: String,
});

userSchema.statics.hashPassword = (clearPassword) => {
  return bcrypt.hash(clearPassword, 7);
};

userSchema.methods.comparePassword = function (clearPassword) {
  return bcrypt.compare(clearPassword, this.password);
};

userSchema.methods.sendEmail = async function (subject, body) {
  const transport = createTransport()
  const result = await sendEmail({
    transport,
    to: this.email,
    subject,
    body
  })
  const previewURL = generatePreviewURL(result)
  console.log('EMAIL SIMULADO: ', previewURL);
};

const User = mongoose.model("User", userSchema);

export default User;
