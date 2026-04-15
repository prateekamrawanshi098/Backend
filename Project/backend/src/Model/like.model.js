const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "user is required for creating a like"],
    },

    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "post id is required for creatring a like"],
    },
  },
  {
    timestamps: true,
  },
);

likeSchema.index(
  {
    posts: 1,
    user: 1,
  },
  {
    unique: true,
  },
);

const likeModel = mongoose.model("likes",likeSchema);


module.exports=likeModel
