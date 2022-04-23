// https://stackoverflow.com/questions/55796293/make-a-bullet-object-in-p5-js-javascript
// function Bullet(X,Y,PX,PY){
//     this.speed = 2;
//     this.x = PX;
//     this.y = PY;
//     this.dir = createVector(X-PX, Y-PY).normalize()
//     this.r = 5;

//     this.show = function(){
//       fill(255,255,0);
//       stroke(128,128,0);
//       circle(this.x,this.y,this.r);
//     }
//     this.toMouse = function() {
//         this.x += this.dir.x * this.speed;
//         this.y += this.dir.y * this.speed;
//     }
//     this.onScreen = function() {
//       return this.x > -this.r && this.x < width+this.r &&
//               this.y > -this.r && this.y < height+this.r;
//     }
// }