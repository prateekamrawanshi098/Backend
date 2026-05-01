import { useCallback, useEffect, useState } from "react";
import {
  disconnectSocket,
  initializeSocketConnection,
} from "../Service/chat.socket";

export const useChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const socket = initializeSocketConnection();

    const handleConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
    };

    const handleMessage = (message) => {
      console.log("Socket message received:", message);
      setMessages((currentMessages) => [...currentMessages, message]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat:message", handleMessage);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat:message", handleMessage);
      disconnectSocket();
    };
  }, []);

  const sendMessage = useCallback((message) => {
    const socket = initializeSocketConnection();
    console.log("Emitting chat:message event:", message);
    socket.emit("chat:message", message);
  }, []);

  return {
    isConnected,
    messages,
    sendMessage,
    socketId,
  };
};
