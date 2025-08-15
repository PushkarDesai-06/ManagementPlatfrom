import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  { collection: "User" }
);

export const User = mongoose.model("User", userSchema);
