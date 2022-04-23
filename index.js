const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server); // create instance of socketio

app.use(express.static("public")); // use "public" directory for static files

var ids = {};  // name : id
var rid = {}; // id   : name
var pos = {"bob": [10, 30]};      // name  : [x, y]
var zom = [];      // index : [alive, x, y, velocity(x, y), ] 
var bullets = [];  // index : [alive, x, y, velocity(x, y), velocity decay(x, y), damage]


io.on("connection", socket => {
  socket.on("joined", (name) => { // when server recieves the "joined" message
    if (!(name in pos)&&name.length>0){
      pos[name]=[];
      ids[name]=socket.id;
      io.emit("joined", name);
      socket.broadcast.to(ids[name]).emit("accepted");
    }
  });
  socket.on("disconnect", () => { // when someone closes the tab
    io.emit("leave");
  });
});

server.listen(3000); // run server