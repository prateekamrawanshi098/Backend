import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api/chats",
  withCredentials: true,
});

export async function getChats() {
  const response = await api.get("/");
  return response.data;
}

export async function getMessages(chatId) {
  const response = await api.get(`/${chatId}/messages`);
  return response.data;
}

export async function sendChatMessage({ chatId, userMessage }) {
  const response = await api.post("/message", {
    userMessage,
    chat: chatId || undefined,
  });
  return response.data;
}

export async function deleteChat(chatId) {
  const response = await api.delete(`/${chatId}`);
  return response.data;
}
