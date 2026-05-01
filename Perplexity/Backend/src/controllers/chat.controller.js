import { AIResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/messages.model.js";
import mongoose from "mongoose";

export async function sendMessageController(req, res) {
  const { userMessage, chat: chatId } = req.body;
  const content = userMessage?.trim();

  if (!content) {
    return res.status(400).json({
      message: "message is required",
    });
  }

  if (chatId && !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({
      message: "invalid chat id",
    });
  }

  let chat = null;

  if (chatId) {
    chat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "chat not found",
      });
    }
  } else {
    const generatedTitle = await generateChatTitle(content);
    const chatTitle =
      generatedTitle?.trim().slice(0, 100) || content.slice(0, 60);

    chat = await chatModel.create({
      user: req.user.id,
      title: chatTitle,
    });
  }

  const userMessageDocument = await messageModel.create({
    chat: chat._id,
    content,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chat._id }).sort({
    createdAt: 1,
  });

  const aiResponse = await AIResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chat._id,
    content: aiResponse,
    role: "Ai",
  });

  chat = await chatModel.findByIdAndUpdate(
    chat._id,
    { updatedAt: new Date() },
    { new: true },
  );

  res.status(201).json({
    message: "message sent successfully",
    chat,
    userMessage: userMessageDocument,
    aiMessage,
  });
}

export async function getChat(req, res) {
  const user = req.user;

  const chats = await chatModel
    .find({
      user: user.id,
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    message: "chats fetched successfully",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({
      message: "invalid chat id",
    });
  }

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "chat not found",
    });
  }

  const messages = await messageModel.find({ chat: chatId }).sort({
    createdAt: 1,
  });

  res.status(200).json({
    message: "Messages fetched successfully",
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({
      message: "invalid chat id",
    });
  }

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "chat not found",
    });
  }

  await messageModel.deleteMany({
    chat: chatId,
  });

  res.status(200).json({
    message: "chat deleted successfully",
    chat,
  });
}

