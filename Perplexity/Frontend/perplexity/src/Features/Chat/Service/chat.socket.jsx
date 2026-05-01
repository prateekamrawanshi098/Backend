import { io } from "socket.io-client";

let socket;

export const initializeSocketConnection = () => {
  if (!socket) {
    socket = io("http://localhost:3001", {
      autoConnect: false,
      withCredentials: true,
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const initializesocketconnection = initializeSocketConnection;
