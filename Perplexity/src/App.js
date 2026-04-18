import express from "express";
import authrouter from "./Router/auth.router.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authrouter);

export default app;
