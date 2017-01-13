var boardScore;
var ball;
var ping;
var sparks = [];
var ketchup;
var invaders = [];
var bullets = [];
var randos = [];

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
    this.canvas.onmousedown = function(){
      fire();
    };

    // mySound = new Audio("sounds/ping.wav");
    // my compnent constructor syntax
    // (width, height, cx, cy, type, source, sx, sy, swidth, sheight, soffset, dwidth, dheight){

    ketchup = new Component(10, 10, 300, 10, "ketchup", 'img/ketchup.png');
    invaders.push (new Component(10, 10, 0, 10, "invader", 'img/invaders.gif', 18, 13 , 112 , 83, 146, 112, 83));
    invaders.push (new Component(10, 10, 150, 10, "invader", 'img/invaders.gif', 311, 13, 83, 86, 116 , 83, 86));
    invaders.push (new Component(10, 10, 300, 10, "invader", 'img/invaders.gif', 236, 494, 80, 82, 111 , 80, 82));
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
  this.rotateCounter2 = 4;
  this.soffset = soffset;
  this.dwidth = dwidth;
  this.dheight = dheight;
  // this.speedXpos = 1;
  // this.speedXneg = -1;
  this.speedX = 0;
  this.speedY = 0;
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
    if(myArea.frameNo % 40 === 0){
      this.newPos();
      this.rotateCounter ++;
    }
    ctx = myArea.context;
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
      if(this.rotateCounter % 2 === 0){
        this.sxRef = this.sx2;
      }
      else{
        this.sxRef = this.sx;
      }
      this.cx +=this.speedX;
      this.cy +=this.speedY;
      ctx.drawImage(this.image, this.sxRef, this.sy, this.swidth, this.sheight, this.cx, this.cy, this.dwidth, this.dheight);
    }
  },
  this.newPos = function(){
    if(this.rotateCounter2  === 4){
      this.speedX = 0;
      this.speedY =.3;
      this.rotateCounter2 --;
    }
    else if(this.rotateCounter2 === 3){
      this.speedX = .3;
      this.speedY =0;
      this.rotateCounter2 --;

    }
    else if( this.rotateCounter2  === 2){
      this.speedX = 0;
      this.speedY = .3;
      this.rotateCounter2 --;

    }
    else{
      this.speedX = -.3;
      this.speedY = 0;
      this.rotateCounter2 = 4;
    }
  }

}
//reserve for sparks when collision
function Bullet (cx, cy){
  this.cx = cx;
  this.cy = cy;
  this.image = new Image();
  this.image.src = "img/invaders.gif";
  // this.speedX = speedX;
  this.speedY = -10;
  ctx = myArea.context;
  this.update = function(){
    this.cy += this.speedY;
    //  reference :     ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, this.cx, this.cy, this.dwidth, this.dheight);
    ctx.drawImage(this.image, 484, 390, 36, 60, this.cx, this.cy, 36, 60);
  },
  this.crashWith = function(otherObj){
    var myLeft = this.cx;
    var myRight = this.cx + 36;
    var myTop = this.cy;
    var myBottom = this.cy + 60;
    var otherLeft = otherObj.cx;
    var otherRight = otherObj.cx + otherObj.swidth;
    var otherBottom = otherObj.cy + otherObj.sheight;
    var otherTop = otherObj.cy;
    if( myLeft < otherRight && myRight > otherLeft && myTop < otherBottom && (myBottom > otherTop)) {
      var bulletIndex = bullets.indexOf(this);
      bullets.splice(invaderIndex, 1);
      var invaderIndex = invaders.indexOf(otherObj);
      otherObj.sx = 356;
      otherObj.sx2 = 356;
      otherObj.sy = 626;
      otherObj.swidth = 100;
      otherObj.sheight = 77;
      drawSparks(otherObj.cx, otherObj.cy);
      setTimeout(function(){
        invaders.splice(invaderIndex, 1);
      }, 300);
    }
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
  if(bullets.length > 0){
    bullets.forEach(function(bullet){
      invaders.forEach(function(invader){
        bullet.crashWith(invader);
      });
      bullet.update();
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
function Spark(cx, cy, speedX, speedY){
  this.cx  = cx;
  this.cy = cy;
  this.gravity = .4;
  this.speedX = speedX;
  this.speedY = speedY;
  this.update = function(){
    var ctx = myArea.context;
    ctx.fillStyle = "white";
    this.speedY += this.gravity;
    this.speedX *= .96;
    this.cx += this.speedX;
    this.cy += this.speedY;
    ctx.fillRect(this.cx, this.cy, 10, 10);
    console.log(sparks.length);
  };
}

var drawSparks = function(x, y){
  sparks.push(new Spark(x,y, 10, 15));
  sparks.push(new Spark(x,y, 12, 14));
  sparks.push(new Spark(x,y, 15, 11));
  sparks.push(new Spark(x,y, 18, 20));
  sparks.push(new Spark(x-30, y, -10, 15));
  sparks.push(new Spark(x+30, y, -5, 13));
  sparks.push(new Spark(x-30, y, -13, 11));
  sparks.push(new Spark(x+30, y, -16, 18));
}

function fire(){
  bullets.push(new Bullet(myArea.x, 690));
}

myArea.start();
// drawHighScores();
