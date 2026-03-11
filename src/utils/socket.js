const socket = require("socket.io");
const crypto = require('crypto')

const getSecretRoomId = (userId, targetUserId) =>{
    return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('_'))
    .digest('hex')
}
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
    socket.on("joinChat", ({firstName, userId, targetUserId}) => {
        const roomId = getSecretRoomId(userId, targetUserId)
        console.log(firstName,'joined the room :', roomId)
        socket.join(roomId)
    });

    socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
        const roomId =  getSecretRoomId(userId, targetUserId)
        console.log(firstName, text);
        io.to(roomId).emit('messageReceived',{firstName, text})

    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
