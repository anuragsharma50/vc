const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
    console.log("user connected",socket.id)
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    console.log("user disconnect")
    socket.broadcast.emit('callEnded');
  });

  socket.on('callUser', (data) => {
    console.log("callUser emitted",data.userToCall);
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(5000, () => console.log('Server is running on port 5000'));
