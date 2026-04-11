const express = require("express");
const authRouter = express.Router();
const authController=require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware");


authRouter.post("/register", authController.registrationController);

authRouter.post("/login",authController.loginController)

module.exports = authRouter;
