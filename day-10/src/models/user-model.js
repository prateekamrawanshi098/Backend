const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique:[true,"This email is already registered"]
    },
    password:String
})

const userModel = mongoose.model("user", schema);

module.exports = userModel;