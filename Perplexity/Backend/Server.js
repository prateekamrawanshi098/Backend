import "dotenv/config";
import http from "http";
import app from "./src/App.js";
import connectToDatabase from "./src/config/Database.js";
import { initSoketio } from "./src/sockets/socket.io.js";
import { log } from "console";

const httpServer = http.createServer(app);
initSoketio(httpServer);
connectToDatabase();

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});


