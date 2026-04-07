const express = require("express");
const userModel = require("../models/user-model");
const webtoken = require("jsonwebtoken");
const crypto=require("crypto")

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const userAlreadyExits = await userModel.findOne({ email });

  if (userAlreadyExits) {
    return res.status(400).json({
      message: "User already exist with this email ",
    });
    }
    
    const hash=crypto.createHash("md5").update(password).digest("hex")

  const user = await userModel.create({
    email,
    name,
   password: hash,
  });

  const token = webtoken.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "user registered",
    user,
    token,
  });
});

authRouter.post("/protected", (req, res) => {
  console.log(req.cookies);

  res.status(200).json({
    message: "cookie recieved",
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
    

    if (!user) {
        return res.status(404).json({
          message : "email not registered"
      })
    }  
    
    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex");

    if (!isPasswordMatched) {
        return res.status(401).json({
            message: "invalid password"
        })
    }

    const token = webtoken.sign({
        id:user._id,
    }, process.env.JWT_SECRET)
    
    res.cookie("jwt_token", token)
    
    res.status(200).json({
        message: "user is login",
        user
    })
});

module.exports = authRouter;
