import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: [true, "chat Id is required"],
    },
    content: {
      type: String,
      required: [true, "content is required"],
      enum: ["user", "Ai"],
    },
  },
  {
    timestamps: true,
  },
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
