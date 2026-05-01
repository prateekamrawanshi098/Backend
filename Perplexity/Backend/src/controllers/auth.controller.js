import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isUserExits = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExits) {
    return res.status(400).json({
      message: "user already exists",
      success: false,
      err: "user already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity",
    html: `
  <p>
    Hi ${username}, <br><br>
    Thank you for registering at Perplexity. We're excited to have you on board!<br><br>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    <p>If you do not create an account , please ignore this message</p>
    Best regards,<br>
    The Perplexity Team
  </p>
`,
  });

  res.status(201).json({
    message: `${username} registered successfully`,
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function verifyEmailController(req, res) {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  user.verified = true;
  await user.save();

  res.send(
    `<h1/>Email verified succesffully you can now login to your account</h1>
    <a href="api/auth/login">login to your account</a>    
    `,
  );
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }

  const isPassword = await user.comparePassword(password);

  if (!isPassword) {
    return res.status(400).json({
      message: "Invalid user or password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify email before login",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successfull",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getmeController(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    user
  });
}
