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


var pos = {"bob": [10, 30]};      // name  : [x, y]
var zom = [];      // index : [alive, x, y, velocity(x, y), ] 
var bullets = [];  // index : [alive, x, y, velocity(x, y), velocity decay(x, y), damage]

var username="";
var truename="";

var settings={"login":"open", "text_selected":"none"}

let ui_buttons=[]

function draw(){
  if(inputs.clickL){
    settings["text_selected"]="none";
  }
  background(0, 0, 0);

  fill(0, 255, 0);
  textSize(10);
  textAlign(CENTER, BOTTOM);
  for (let n in pos){
    if (truename in settings){
      text(n, pos[n][0]+pos[truename][0], pos[n][1]+pos[truename][1]-10);
      ellipse(pos[n][0]+pos[truename][0], pos[n][1]+pos[truename][1], 10, 10);
    }else{
      text(n, pos[n][0], pos[n][1]-10);
      ellipse(pos[n][0], pos[n][1], 10, 10);
    }
  }

  fill(colors["uidefault"]);
  textSize(25);
  textAlign(LEFT, TOP);
  if(settings["login"]=="open"){
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
    
  }else{
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
    inputs.clickL=false;
    inputs.clickR=false;
}




window.addEventListener("keydown", function(key){
  if (settings["text_selected"]!="none"){
    if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".split("").includes(key.key)){
      if (settings.text_selected=="username"){
        if(username.length<12){
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
  truename=username;
});

socket.on("joined", user => { // when server tells client that someone has joined
  pos[user]=[random(0, width), random(0, height)];
});