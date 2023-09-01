// server.js
const express = require('express');
const http = require('http');

const cors = require('cors');

const app = express();

app.use(cors());

// app.use(function (req, res, next) {
//   console.log("here")
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   next()
// });


const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const rooms = {};

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    const { roomId, username } = data;
    
    socket.join(roomId);
    
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    console.log(socket.id, roomId)
    rooms[roomId].push({ socketId: socket.id, username });
    
    io.to(roomId).emit('userList', rooms[roomId].map(user => user.username));
  });

  socket.on('sendMessage', (data) => {
    const { roomId, message } = data;
    io.to(roomId).emit('receiveMessage', { username: rooms[roomId].find(user => user.socketId === socket.id).username, message });
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const userIndex = rooms[roomId].findIndex(user => user.socketId === socket.id);
      if (userIndex !== -1) {
        rooms[roomId].splice(userIndex, 1);
        io.to(roomId).emit('userList', rooms[roomId].map(user => user.username));
        break;
      }
    }
  });
});

server.listen(3001, () => {
  console.log('Socket.io server listening on port 3001');
});
