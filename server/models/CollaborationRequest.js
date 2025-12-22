import mongoose from "mongoose";

const collabSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requiredSkills: [String],
    status: { type: String, enum: ["open", "accepted", "closed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("CollaborationRequest", collabSchema);
