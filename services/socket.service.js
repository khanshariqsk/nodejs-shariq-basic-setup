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

const shutdownServer = (server, io) => {
  console.log("Closing server gracefully...");

  // Close socket.io connections
  io.close(() => {
    console.log("Socket.io connections closed.");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
};

const closeServerHandler = (server, io) => {
  // Listen for shutdown signals
  process.on("SIGINT", () => {
    shutdownServer(server, io);
  });
  process.on("SIGTERM", () => {
    shutdownServer(server, io);
  });
  process.on("SIGQUIT", () => {
    shutdownServer(server, io);
  });
};

module.exports.mountSocket = mountSocket;
module.exports.closeServerHandler = closeServerHandler;
