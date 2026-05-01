import express from "express"
import { authUser } from "../middleware/auth.middleware.js"
import { deleteChat, getChat, getMessages, sendMessageController } from "../controllers/chat.controller.js";


const chatRouter = express.Router()

chatRouter.post("/message", authUser, sendMessageController);
chatRouter.get("/", authUser, getChat)
chatRouter.get("/:chatId/messages",authUser,getMessages)
chatRouter.delete("/:chatId", authUser, deleteChat)



export default chatRouter
