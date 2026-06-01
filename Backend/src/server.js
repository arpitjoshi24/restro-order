require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const setupOrderSocket = require("./sockets/order.socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

setupOrderSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});