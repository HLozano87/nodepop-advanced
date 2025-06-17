import { Server } from "socket.io";

export function setupWebSocketServer(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Nueva conexión de un cliente con id", socket.id);

    socket.on("chat-message", (payload) => {
      console.log(
        `Mensaje recibido del cliente id: ${socket.id} y texto: "${payload}"`
      );
      io.emit("chat-message", payload);
    });
  });
}
