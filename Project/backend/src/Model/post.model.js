const mongoose=require("mongoose")

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default:""
    },
    imgURL: {
        type: String,
        required:[true,"imgURL is required"]
    },

    userId: {
        ref: "usersModel",
        type: mongoose.Schema.Types.ObjectId,
        required:[true,"user id is required for creating post"]
    }
})

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel