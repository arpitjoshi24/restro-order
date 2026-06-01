const setupOrderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(" Kitchen/User connected:", socket.id);

    // optional: join kitchen room
    socket.on("join_kitchen", () => {
      socket.join("kitchen_room");
      console.log("Joined kitchen room");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};

module.exports = setupOrderSocket;