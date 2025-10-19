import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: String,
  ssn: String,
});

export const User = mongoose.model("User", UserSchema);
