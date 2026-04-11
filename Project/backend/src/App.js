const express = require("express")
const authRouter=require("../src/Routes/Auth.routes")
const cookieParser = require("cookie-parser")
const postRouter = require("./Routes/post.routes")
const userRouter = require("./Routes/user.routes")
const cors=require("cors")


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);


app.use("/api/auth", authRouter)
app.use("/api", postRouter)
app.use("/api/user", userRouter);

module.exports=app