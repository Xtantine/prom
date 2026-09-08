const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  // Join World Chat
  socket.on('join_world_chat', () => {
    socket.join('world_chat');
  });

  // Broadcast World Chat Message
  socket.on('send_world_message', (data) => {
    io.to('world_chat').emit('receive_world_message', data);
  });

  // Private Messaging Room Setup
  socket.on('join_dm', ({ user1, user2 }) => {
    const room = [user1, user2].sort().join('_');
    socket.join(room);
  });

  // Send Direct Message
  socket.on('send_dm', (data) => {
    const room = [data.sender, data.recipient].sort().join('_');
    io.to(room).emit('receive_dm', data);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});