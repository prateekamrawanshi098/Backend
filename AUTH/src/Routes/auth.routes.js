const express = require("express");
const userModel = require("../model/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const { log } = require("console");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isEmail = await userModel.findOne({ email });

  if (isEmail) {
    return res.status(409).json({
      message: "email already existed",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  const user = await userModel.create({
    name,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1H" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: " user created successfully",
    user,
  });
});

authRouter.get("/get-me", async (req, res) => {
  const token = req.cookies.token;

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  console.log(decode);

  const user = await userModel.findById(decode.id);

    res.json({
        name: user.name,
        email:user.email
  });
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    
    const user =await userModel.findOne({ email })
    
    if (!user) {
        return res.status(409).json({
         message:"email not registered"
     })   
    }

    if (user.password === crypto.createHash("md5").update(password
    ).digest("hex")) {
        
        const token = jwt.sign({
            id: user._id,
            email:email
        }, process.env.JWT_SECRET)
        
        res.cookie("token", token)
        
        res.json({
            message: "user login successfully",
            user
        })


    }

    else {
        res.json({
            message:"invalid password"
        })
    }

})

module.exports = authRouter;
