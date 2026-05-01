import express from "express";
import cookieParser from "cookie-parser";
import authrouter from "./Router/auth.router.js";
import morgan from "morgan"
import cors from "cors"
import chatRouter from "./Router/chat.router.js";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))

app.use("/api/auth", authrouter);
app.use("/api/chats", chatRouter);

export default app;
