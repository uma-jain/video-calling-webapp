const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server,{
  //https://evening-shelf-31784.herokuapp.com/
  cors: {
    origin: "https://evening-shelf-31784.herokuapp.com",
    methods: ["GET", "POST"]
  }
});
const path = require('path');

const cors=require('cors');
// Peer

const { ExpressPeerServer } = require("peer");
const { resolve } = require("path");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);
app.use(cors())



app.get('/uma', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
io.on("connect", (socket) => {
  console.log("user connected "+socket.id);
 
  socket.on("join-room", (roomId, userId,name) => {           
  socket.name=name
  socket.peerId=userId
  socket.join(roomId);

    console.log(`connected user peer details : socketId:${socket.id}  peerId :${socket.peerId} roomId :${roomId}`);
      
   socket.broadcast.to(roomId).emit("user-connected",{socketId:socket.id,name:socket.name,peerId:socket.peerId});

      socket.on("message", (message) => {
        io.to(roomId).emit("createMessage", {message,name:socket.name});
      });
      socket.on('disconnect', function(){

        console.log(`disconnected peer details : socketId:${socket.id}  peerId :${socket.peerId} roomId :${roomId}`);
          socket.broadcast.to(roomId).emit('user-disconnected',{socketId:socket.id,name:socket.name,peerId:socket.peerId});

      });

  });
 

});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  console.log("in production ");

  app.use(express.static('client/build'));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'));
  });
}


server.listen(process.env.PORT || 5000);
