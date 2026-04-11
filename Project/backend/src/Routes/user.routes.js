const express = require("express")

const userRouter = express.Router()
const followUserController=require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")


userRouter.post("/follow/:username", identifyUser, followUserController.followUserController)

userRouter.post("/unfollow/:username", identifyUser, followUserController.unfollowUserController)

userRouter.get("/requests", identifyUser, followUserController.getRequestController)

userRouter.patch("/accept/:username", identifyUser, followUserController.acceptRequestController)

userRouter.patch("/reject/:username",identifyUser,followUserController.rejectRequestController)

module.exports=userRouter