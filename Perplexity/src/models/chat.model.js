import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      maxlength: [100, "title cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true,
  },
);

const chatModel = mongoose.model("chat", chatSchema);

export default chatModel;
