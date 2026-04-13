// Синглтон Socket.IO (практика 16)
let _io = null;

function initSocket(server) {
  const { Server } = require("socket.io");
  _io = new Server(server, {
    cors: { origin: "http://localhost:3001", methods: ["GET", "POST"] },
  });

  _io.on("connection", (socket) => {
    console.log("WS клиент подключён:", socket.id);
    socket.on("disconnect", () => {
      console.log("WS клиент отключён:", socket.id);
    });
  });

  return _io;
}

function getIo() {
  if (!_io) throw new Error("Socket.IO не инициализирован");
  return _io;
}

module.exports = { initSocket, getIo };
