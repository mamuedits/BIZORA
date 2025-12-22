import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["going", "interested", "cancelled"], default: "going" }
  },
  { timestamps: true }
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);
