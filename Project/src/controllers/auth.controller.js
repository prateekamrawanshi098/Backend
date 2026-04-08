const userModel = require("../Model/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

async function registrationController(req, res) {
  const { username, email, password, bio, profilePicture } = req.body;

  // const isEmailExists = await userModel.findOne({ email })

  // if (isEmail) {
  //     return res.status(409).json({
  //         message:"email already existed"
  //     })
  // }

  // const isUsernameExists = await userModel.findOne({ username })

  // if (isUsernameExists) {
  //     return res.status(409).json({
  //         message: "username not available"
  //     })
  // }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        "user already exists " +
        (isUserAlreadyExists.email === email
          ? "email already exists"
          : "username already exists"),
    });
  }

  const user = await userModel.create({
    username,
    email,
    password: crypto.createHash("sha256").update(password).digest("hex"),
    bio,
    profilePicture,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user registered successfully",
    user: {
      username,
      email,
      bio,
    },
  });
};


async function loginController(req, res){

    const {email,username,password}=req.body
    const isUserExits =await userModel.findOne({
        $or: [
            {
                username
            },
            {
                email
            }
        ]
    })

    if (!isUserExits) {
        return res.status(404).json("email or username doesn't exists")
    }

    

    const isPasswordValid = isUserExits.password === crypto.createHash("sha256").update(password).digest("hex")
    
    if (!isPasswordValid) {
        return res.status(401).json({
            message:"invalid password"
        })
    }

    const token = jwt.sign({
        id:isUserExits._id
    }, process.env.JWT_SECRET)
    
    res.cookie("token", token)
    
    res.status(200).json({
        message:"login successfully"
    })

}

module.exports = {
    loginController,
    registrationController
}