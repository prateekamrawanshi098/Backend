import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

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
  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity",
    html: `
  <p>
    Hi ${username}, <br><br>
    Thank you for registering at Perplexity. We're excited to have you on board!<br><br>
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
