import { Server } from "socket.io";
import * as sessionManager from "./lib/sessionManager.js";

export let io;

export function setupWebSocketServer(httpServer) {
  io = new Server(httpServer);

  io.engine.use(sessionManager.sessionUser);

  io.on("connection", (socket) => {
    const sessionId = socket.request.session.id;
    socket.join(sessionId);

    socket.on("welcome-user", message => {
      io.emit("welcome-user", message);
    });

    socket.on("close-session", message => {
      io.emit("close-session", message);
    });
  });
}
