import { Router } from "express";
import { registerValidator } from "../validator/auth.validation.js";
import { registerController } from "../controllers/auth.controller.js";

const authrouter = Router()

authrouter.post("/register",registerValidator,registerController)


export default authrouter