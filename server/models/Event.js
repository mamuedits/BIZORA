import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: String, // "Meetup", "Hackathon", ...
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "online" },
    location: String,
    meetingLink: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    maxParticipants: Number,
    bannerUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
