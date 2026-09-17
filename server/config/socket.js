const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ SRE Client Connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔥 Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io engine is not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };