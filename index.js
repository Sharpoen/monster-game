const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server); // create instance of socketio

app.use(express.static("public")); // use "public" directory for static files

var ids = {};  // name : id
var rid = {}; // id   : name
var status = {};

var pos = {};      // name  : [x, y]
var zom = [];      // index : [alive, x, y, velocity(x, y), ] 
var bullets = [];  // index : [alive, x, y, velocity(x, y), velocity decay(x, y), damage]


io.on("connection", socket => {
  socket.on("joined", (name) => { // when server recieves the "joined" message
    if (!(name in pos)&&name.length>0){
      if(socket.id in rid){
        delete ids[rid[socket.id]]
        pos[name] = pos[rid[socket.id]];
        delete pos[rid[socket.id]];
        delete status[rid[socket.id]];
        rid[socket.id]=name;
        ids[name]=socket.id;
        status[name]="online";
      }else{
        pos[name]=[];
        ids[name]=socket.id;
        rid[socket.id]=name;
        status[name]="online";
        io.emit("joined", name);
        socket.emit("accepted", null);
      }
    }
  });
  socket.on("update me", data => {
    pos[rid[socket.id]]=data;
  });
  socket.on("shot", bullet => {
    io.emit("shot", bullet);
  });
  socket.on("disconnect", () => { // when someone closes the tab
    io.emit("leave");
    status[rid[socket.id]] = "offline";
    delete pos[rid[socket.id]];
    delete ids[rid[socket.id]];
    delete rid[socket.id];
  });
});

setInterval(function(){
  io.emit("force_update-players", pos);
}, 300)

server.listen(3000); // run server