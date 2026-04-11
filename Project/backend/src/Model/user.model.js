const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already existed"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "email already existed"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  profilePicture: {
    type: String,
    default: "https://ik.imagekit.io/r35i8psgvz/default.jpg",
  },
});

const userModel = mongoose.model("userModel", userSchema)

module.exports=userModel