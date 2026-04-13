const http = require("http");
const { createApp } = require("./src/app");
const { initSocket } = require("./src/socket");

const PORT = 3000;
const app = createApp();

// HTTP-сервер + Socket.IO (практика 16)
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
