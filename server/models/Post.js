import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true,maxlength: 100 }
  },
  { timestamps: true }
);

const ideaSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    image: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      required: true
    },

    hashtags: [String],

    links: [String],

    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    comments: [commentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Idea", ideaSchema);
