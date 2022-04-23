const socket = io(); 

socket.on("joined", user => {
});

socket.on("leave", user => {
});


var  colors={};

function setup(){
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  stroke(0, 0);
  colors["highlight"]=color(0, 100, 255);
  colors["uidefault"]=color(255, 255, 255);
  colors["selected"]=color(255, 255, 0);
}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function hitrect(ux, uy, x, y, w, h){
  if(ux>x && ux<x+w && uy>y && uy<y+h){
    return true;
  }else{
    return false;
  }
}
// i know this is terrible programming but i'm lazy
function mrect(x, y, w, h){
  return hitrect(mouseX, mouseY, x, y, w, h);
}


var mypos=[0, 0, 0];


setInterval(function(){
  socket.emit("update me", mypos);
})


var blocks = [];   // [x, y, health]
var pos = {};      // name  : [x, y. direction]
var zom = [];      // [x, y, [goal x, goal y], speed, health]
var bullets = [];  // [x, y, direction, speed, decay]

let tmbp;

setInterval(function(){

  // input
  
  if (inputs.up) {
    mypos[1]-=3;
  }
  if (inputs.down) {
    mypos[1]+=3;
  }
  if (inputs.left) {
    mypos[0]-=3;
  }
  if (inputs.right) {
    mypos[0]+=3;
  }

  // bullets

  for(let i=bullets.length-1; i>=0; i--){
    bullets[i][0]+=bullets[i][2].x*bullets[i][3];
    bullets[i][1]+=bullets[i][2].y*bullets[i][3];

    if(dist(mypos[0], mypos[1], bullets[i][0], bullets[i][1])<=25){
      // mypos[0]=0;
      // mypos[1]=0;
      bullets.splice(i, 1);
    }else{
      
      bullets[i][3]-=bullets[i][4];
  
      if(bullets[i][3]<0 || bullets[i][3]>50){
        bullets.splice(i, 1);
      }
    }
  }
  
},15);

var username="";
var truename="";

// flags for user interface
var settings={"login":"open", "text_selected":"none"}

let ui_buttons=[]

function draw(){
  mypos[2]=createVector(0+(mouseX-width/2), 0+(mouseY-height/2)).normalize();
  
  if(inputs.clickL){
    settings["text_selected"]="none";
  }
  background(0, 0, 0);

  // render blocks
  fill(255, 100, 50);
  tmpb = Array.from(blocks);
  for(let i=0;i<tmpb;i++){
    ellipse(blocks[i][0]-pos[truename][0]+width/2, blocks[i][1]-pos[truename][1]+height/2, 25, 25)
  }
  
  // render players
  fill(0, 255, 0);
  textSize(10);
  textAlign(CENTER, BOTTOM);
  for (let n in pos){
    if (truename in pos){
      text(n, pos[n][0]-pos[truename][0]+width/2, pos[n][1]-pos[truename][1]+height/2-25);
      ellipse(pos[n][0]-pos[truename][0]+width/2, pos[n][1]-pos[truename][1]+height/2, 25, 25);
      if(pos[n][2]){
        strokeWeight(10);
        stroke(0, 255, 0);
        line(pos[n][0]-pos[truename][0]+width/2, pos[n][1]-pos[truename][1]+height/2, pos[n][0]-pos[truename][0]+width/2+pos[n][2].x*45, pos[n][1]-pos[truename][1]+height/2+pos[n][2].y*45);
        stroke(0,0);
      }
    }else{
      text(n, pos[n][0]+width/2, pos[n][1]+height/2-10);
      ellipse(pos[n][0]+width/2, pos[n][1]+height/2, 25, 25);
    }
  }

  // render zombies
  
  // fill(255, 0, 0);
  // tmpb = Array.from(zom);
  // for(let i=0; i<tmpb.length; i++){
  //   ellipse(tmpb[i][0]+width/2-mypos[0], tmpb[i][1]+height/2-mypos[1], 25, 25);
  // }

  // render bullets
  
  fill(255, 255, 0);
  tmpb = Array.from(bullets);
  for(let i=0; i<tmpb.length; i++){
    ellipse(tmpb[i][0]+width/2-mypos[0], tmpb[i][1]+height/2-mypos[1], 5, 5);
  }


  if(inputs.clickL){
    socket.emit("shot", [ // x, y, direction, speed, decay
      mypos[0]+mypos[2].x*12, mypos[1]+mypos[2].y*12,
      mypos[2], 15, 0.2
    ]);
  }
  if(inputs.clickR){
    blocks.push([mouseX-width/2+mypos[0], mouseY-height/2+mypos[1], 10]);
  }
  
  fill(colors["uidefault"]);
  textSize(25);
  textAlign(LEFT, TOP);

  // login user interface
  if(settings["login"]=="open") {
    rect(0, 0, width, 25);
    fill(colors["highlight"]);
    if(mrect(0, 0, textWidth("<"), 25)){
      rect(0, 20, textWidth("<"), 5);
      if(inputs.clickL){settings["login"]="closing";}
    }
    fill(0);
    text("<", 0, 0);
    fill(colors["highlight"]);
    if(mrect(textWidth("<")+10, 0, textWidth("Username: ["+username+"]"), 25)){
      if (inputs.clickL){
        settings["text_selected"]="username";
      }
      rect(textWidth("<")+10, 20, textWidth("Username: ["+username+"]"), 5);
    }
    if(settings["text_selected"]=="username"){
      fill(colors["selected"]);
      rect(textWidth("<")+10, 20, textWidth("Username: ["+username+"]"), 5);
    }
    fill(0);
    text("Username: ["+username+"]", textWidth("<")+10, 0);
  
    fill(colors["uidefault"])
    if(mrect(textWidth("<")+10+textWidth("Username: ["+username+"]")+10, 0, textWidth("Connect"), 25)){
      fill(colors["highlight"]);
      if(inputs.clickL){
        fill(colors["selected"])
        socket.emit("joined", username)
      }
      rect(textWidth("<")+10+textWidth("Username: ["+username+"]")+10, 20, textWidth("Connect"), 5);
    }
    fill(0);
    text("Connect", textWidth("<")+10+textWidth("Username: ["+username+"]")+10, 0);
    
  }
  else {
    rect(0, 0, textWidth(">"), 25);
    if (mrect(0, 0, textWidth(">"), 25)){
      fill(colors["highlight"]);
      rect(0, 20, textWidth(">"), 5);
      if(inputs.clickL){
          settings["login"]="open";
      }
    }
    fill(0);
    text(">", 0, 0);
  }

    //
    if(truename!=""){
      pos[truename]=mypos;
    }

    // 
    inputs.clickL=false;
    inputs.clickR=false;
}




window.addEventListener("keydown", function(key){
  if (settings["text_selected"]!="none"){
    if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_ 1234567890=+".split("").includes(key.key)){
      if (settings.text_selected=="username"){
        if(username.length<15){
          username+=key.key;
        }
      }
    } else if (key.keyCode==8){
      let temp=username.split("");
      temp[temp.length-1]="";
      username=temp.join("");
    }
  }
});


socket.on("accepted", function(){
  console.log("ACCEPTED!")
  truename=username;
});

socket.on("joined", user => { // when server tells client that someone has joined
  pos[user]=[random(0, width), random(0, height)];
});

socket.on("force_update-players", data => {
  pos=data;
  pos[truename]=mypos;
});

socket.on("shot", bullet => {
  bullets.push(bullet);
})

socket.on("zombie", monster => {
  zom.push(monster);
});