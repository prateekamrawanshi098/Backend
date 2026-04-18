import { Router } from "express"
import { registrationController } from "../controller/authController.js"

const authRouter = Router()

authRouter.post("/register",registrationController)

export default authRouter