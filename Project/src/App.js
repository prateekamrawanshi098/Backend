const express = require("express")
const authRouter=require("../src/Routes/Auth.routes")
const cookieParser = require("cookie-parser")
const postRouter = require("./Routes/post.routes")


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api",postRouter)

module.exports=app