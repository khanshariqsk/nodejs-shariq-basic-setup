const { Server } = require("socket.io");
const mountSocket = (server) => {
  //configuring socket
  const io = new Server(server, {
    cors: {
      origins: ["*"],
    },
  });

  //socket connection
  io.on("connection", (socket) => {
    console.log("a user connected");

    setInterval(() => {
      io.emit("message", new Date().toISOString());
    }, 5000);
  });

  return io;
};

module.exports = mountSocket;
