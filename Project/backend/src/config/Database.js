const mongoose = require("mongoose");
const likeModel = require("../Model/like.model");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    await likeModel.syncIndexes();
    console.log("connected to DB");
  } catch (error) {
    console.error("database connection error:", error.message);
  }
}

module.exports = connectToDB;
