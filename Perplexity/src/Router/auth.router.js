import { Router } from "express";
import {
  loginValidator,
  registerValidator,
  validate,
} from "../validator/auth.validation.js";
import {
  loginController,
  registerController,
  verifyEmailController,
  getmeController,
} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authrouter = Router();

authrouter.post("/register", registerValidator, registerController);

authrouter.get("/verify-email", verifyEmailController);

authrouter.post("/login", loginValidator, loginController);
export default authrouter;

authrouter.get("/get-me",authUser ,getmeController);
