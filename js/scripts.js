var boardScore;
var ball;
var ping;
var sparks = [];
var ketchup;
var invaders = [];

var scoresRef = firebase.database().ref('scores');
function HighScore(person, finalScore){
  this.person = person;
  this.finalScore = finalScore;
}

var myArea = {
  canvas : document.createElement("canvas"),
  start : function(){
    this.canvas.width = 800;
    this.gameOver = false;
    this.canvas.height = 800;
    this.frameNo = 0;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[2]);
    this.interval = setInterval(updateMyArea, 20);
    this.canvas.style.cursor = "none";
    window.addEventListener('mousemove', function(e){
      myArea.x = e.clientX - (myArea.canvas.offsetLeft - window.pageXOffset);
      myArea.y = e.clientY -(myArea.canvas.offsetTop - window.pageYOffset);
    });
    // mySound = new Audio("sounds/ping.wav");

    // my compnent constructor syntax
    // (width, height, cx, cy, type, source, sx, sy, swidth, sheight, soffset, dwidth, dheight){

    ketchup = new Component(10, 10, 300, 10, "ketchup", 'img/ketchup.png');
    invaders.push (new Component(10, 10, 0, 10, "invader", 'img/invaders.gif', 0, 0 , 146 , 100, 146, 146, 100));
    invaders.push (new Component(10, 10, 290, 10, "invader", 'img/invaders.gif', 311, 13, 83, 86, 116 , 83, 86));
    // boardScore = new Component(10, 10, 300, 10, "text", null);
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function(){
    clearInterval(this.interval);
  }
}


function Component (width, height, cx, cy, type, source, sx, sy, swidth, sheight, soffset, dwidth, dheight){
  this.cx = cx;
  this.cy = cy;
  this.width = width;
  this.height = height;
  this.type = type;
  this.image = new Image();
  this.image.src = source;
  this.rotateCounter = 0;
  this.soffset = soffset;
  this.dwidth = dwidth;
  this.dheight = dheight;
  ctx = myArea.context;
  if(this.type === "invader"){
    this.sxRef = sx;
    this.sx = sx;
    this.sx2 = sx +soffset;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
  }
  this.update = function(){
    if(myArea.frameNo % 40 === 0 ){this.rotateCounter ++;}

    ctx = myArea.context;
    ctx.fillStyle = "white";
    if(this.type === "ketchup"){
      if(myArea.x <10){
        ctx.drawImage(this.image, 10, 690);
      }
      else if (myArea.x > 754){
        ctx.drawImage(this.image, 754, 690);

      }
      else{
        ctx.drawImage(this.image, myArea.x, 690);
      }
    }
    else if (this.type === "invader"){
      // image sx sy swidth sheight cx cy (resize as) width height
      if(this.rotateCounter % 2 ===0){
        this.sxRef = this.sx2;
      }
      else{
        this.sxRef = this.sx;
      }
      ctx.drawImage(this.image, this.sxRef, this.sy, this.swidth, this.sheight, this.cx, this.cy, this.dwidth, this.dheight);

    }

    // else if (this.type === "text"){
    //   ctx.fillStyle = "white";
    //   ctx.font = "50px Arial";
    //   ctx.fillText(myArea.frameNo, 600, 100);
    // }
  }
  //reserve for bullets?
  // this.crashWith = function(otherObj){
  //   var myLeft = this.x;
  //   var myRight = this.x + this.width;
  //   var myTop = this.y;
  //   var myBottom = this.y + this.height;
  //   var otherLeft = otherObj.x;
  //   var otherRight = otherObj.x + otherObj.width;
  //   var otherTop = otherObj.y;
  //   var otherBottom = otherObj.y + otherObj.height;
  //   var position = otherObj.position;
  // }
}
//reserve for sparks when collision
function Spark (x, y, width, height, speedX, speedY){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.gravity = 0.4;
  this.gravitySpeed =0;
  ctx = myArea.context;
  // ctx.fillStyle = "green";
  ctx.fillRect(this.x, this.y, this.width, this.height);
  this.update = function(){
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function updateMyArea(){
  myArea.frameNo ++;
  myArea.clear();
  ketchup.update();
  invaders.forEach(function(invader){
    invader.update();
  })

  if(sparks.length >0){
    sparks.forEach(function(spark){
      spark.update();
    });
  }
}

var playAgain = function(){
    $("#playAgain").hide();
    myArea.frameNo = 0;
    myArea.start();
}

var drawHighScores = function(){
  $("#highScores").empty();
    scoresRef.orderByChild('finalScore').limitToLast(5).on('value', function(snap){
        snap.forEach(function(e){
            $("#highScores").prepend("<li><span>"+e.val().person +" "+ e.val().finalScore +"</span>");
        });
    });
}
var randos = [];

var drawSparks = function(x, y, speedX, speedY){
  // if(speedY > 0){ speedY * 3};
  randos[0] = 8-(Math.floor(Math.random() * 90))/10;
  randos[1] = 8-(Math.floor(Math.random() * 90))/10;
  randos[2] = 8-(Math.floor(Math.random() * 90))/10;
  randos[3] = 8-(Math.floor(Math.random() * 90))/10;
  randos[4] = 8-(Math.floor(Math.random() * 90))/10;
  randos[5] = 8-(Math.floor(Math.random() * 90))/10;
  randos[6] = 8-(Math.floor(Math.random() * 90))/10;
  randos[7] = 8-(Math.floor(Math.random() * 90))/10;
  randos[8] = 8-(Math.floor(Math.random() * 90))/10;
  randos[9] = 8-(Math.floor(Math.random() * 90))/10;
  randos[10] = 8-(Math.floor(Math.random() * 90))/10;
  randos.forEach(function(rando){
    sparks.push(new Spark (x, y, 3, 3 , speedX + rando, speedY - ((rando*rando)/6)));
    sparks.push(new Spark (x, y, 3, 3 , speedX - (rando/ (rando*rando)), speedY - ((rando)/6)));
  });

  // sparks.push(new Spark (x, y, 3, 3, speedX, speedY));
}



myArea.start();
// drawHighScores();
