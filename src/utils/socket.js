const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://dev-tinder-frontend-ashen.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // handle events
    socket.on("joinChat", () => {});
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
