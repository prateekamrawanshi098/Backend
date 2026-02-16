const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: String,
    description:String
})

const newModel = mongoose.model("notes", noteSchema);

module.exports = newModel;