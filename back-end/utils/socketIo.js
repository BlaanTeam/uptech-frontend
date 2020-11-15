const io = require("socket.io")();


io.use((socket,next)=> {

    console.log(socket.handshake);
    next();
})

io.on("connection", (socket) => {
  console.log("SocketIO Client Connected !");
  socket.on('user',(data)=>{
     socket.emit('user',data)
  })
  socket.on('disconnect',() => {
      console.log("SocketIO Client Disconnected !")
  })
});


io.on('error',(error) => {
    console.error(error);
})

module.exports = io;
