import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["founder", "investor", "mentor", "collaborator", "admin"],
      default: "founder",
    },
    avatar: {
      type: String,
      default: null,
      maxlength: 255,
    },
    startupName: String,
    bio: String,
    skills: {
      type: [String],
      default: [],
    },
    links: {
      linkedin: String,
      website: String,
      github: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
