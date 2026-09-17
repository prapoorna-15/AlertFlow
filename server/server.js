const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const { initSocket } = require('./config/socket');

dotenv.config();

const server = http.createServer(app);

// Initialize Socket.IO engine
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`⚡ AlertFlow Engine & WebSockets active on port ${PORT}`);
});