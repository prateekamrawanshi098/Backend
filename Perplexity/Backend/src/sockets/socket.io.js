import { Server } from "socket.io";

let io;

export function initSoketio(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  console.log("Socket io server is running");

  io.on("connection", (socket) => {
    console.log("user connected " + socket.id);

    socket.on("chat:message", (message) => {
      const text = message?.text?.trim();

      if (!text) {
        return;
      }

      console.log("chat:message received", {
        sender: message.sender || "Guest",
        socketId: socket.id,
        text,
      });

      io.emit("chat:message", {
        id: `${socket.id}-${Date.now()}`,
        text,
        sender: message.sender || "Guest",
        socketId: socket.id,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected " + socket.id);
    });
  });
}

export function getIO() {
  return io;
}
