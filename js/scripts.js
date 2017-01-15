var boardScore, ball, ping, myShip;
var sparks = [];
var invaders = [];
var bullets = [];
var randos = [];

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
    document.onmousedown = function(){
      var fireX;
      if(myArea.x < 10){
        fireX =10;}
      else if (myArea.x > 710){
        fireX = 710;
      }
      else{
        fireX = myArea.x;
      }
      fire(fireX);
    };

    // mySound = new Audio("sounds/ping.wav");
    // my compnent constructor syntax
    // (width, height, cx, cy, type, source, sx, sy, swidth, sheight, soffset, dwidth, dheight){

    myShip = new Component(10, 200, 600, 10, "myShip", 'img/invaders.gif', 147, 631, 77, 46, null, 50, 30);

    //row7
    for (var i = 0; i < 9; i++) {
      invaders.push (new Component(10, 10, 40 + (i*85), 10, "invader", 'img/invaders.gif', 18, 13 , 112 , 83, 146, 40, 34));
    }
    //row2-6
    for (var y = 0; y < 5; y++) {
      for (var i = 0; i < 9; i++) {
        invaders.push (new Component(10, 10, 40 +(i *85 ), 50 + (y * 50) , "invader", 'img/invaders.gif', 311, 13, 83, 86, 116 , 39, 40));
      }
    }

    //row 1 (bottom)
    for (var i = 0; i < 9; i++) {
      invaders.push (new Component(10, 10, 40 + (i*85), 300, "invader", 'img/invaders.gif', 236, 494, 80, 82, 111 , 39, 40));
    }
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
  this.speedX = 0;
  this.speedY = 0;
  this.sxRef = sx;
  this.sx = sx;
  this.sx2 = sx +soffset;
  this.sy = sy;
  this.swidth = swidth;
  this.sheight = sheight;
  ctx = myArea.context;
  this.update = function(){
    if(myArea.frameNo % 40 === 0){
      this.newPos();
      this.rotateCounter ++;
    }
    ctx = myArea.context;
    if(this.type === "myShip"){
      if(myArea.x <10){
        ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, 10, 726, this.dwidth, this.dheight);
      }
      else if (myArea.x > 713){
        ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, 713, 726, this.dwidth, this.dheight);
      }
      else{
        ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, myArea.x , 726, this.dwidth, this.dheight);
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
function Bullet (cx, cy, speedY, target){
  this.cx = cx;
  this.cy = cy;
  this.dwidth = 18;
  this.dheight = 30;
  this.image = new Image();
  this.image.src = "img/invaders.gif";
  this.speedY = speedY;
  this.target = target;
  ctx = myArea.context;
  this.update = function(){
    if(this.cy > 800 || this.cy < 0){
      var bulletIndex = bullets.indexOf(this);
      bullets.splice(bulletIndex, 1);
      console.log(bullets.length);
    }
    this.cy += this.speedY;
    //  reference :     ctx.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, this.cx, this.cy, this.dwidth, this.dheight);
    ctx.drawImage(this.image, 484, 390, 36, 60, this.cx, this.cy, this.dwidth, this.dheight);
  },
  this.crashWith = function(otherObj){
    var myLeft = this.cx;
    var myRight = this.cx + this.dwidth;
    var myTop = this.cy;
    var myBottom = this.cy + this.dheight;
    var otherLeft = otherObj.cx;
    var otherRight = otherObj.cx + otherObj.dwidth;
    var otherBottom = otherObj.cy + otherObj.dheight;
    var otherTop = otherObj.cy;
    if( myLeft < otherRight && myRight > otherLeft && myTop < otherBottom && (myBottom > otherTop)) {
      var bulletIndex = bullets.indexOf(this);
      bullets.splice(bulletIndex, 1);
      var invaderIndex = invaders.indexOf(otherObj);
      otherObj.sx = 356;
      otherObj.sx2 = 356;
      otherObj.sy = 626;
      otherObj.swidth = 100;
      otherObj.sheight = 77;
      drawSparks(otherObj.cx, otherObj.cy);
      setTimeout(function(){
        invaders[invaderIndex] = null
      }, 200);
    }
  }
}
function updateMyArea(){
  myArea.frameNo ++;
  myArea.clear();
  myShip.update();
  alienFire();
  invaders.forEach(function(invader){
    if(invader){invader.update();}
  })
  if(sparks.length >0){
    sparks.forEach(function(spark){
      spark.update();
    });
  }
  if(bullets.length > 0){
    bullets.forEach(function(bullet){
      if(bullet.target === "invader"){
        invaders.forEach(function(invader){
          if(invader){bullet.crashWith(invader);}
        });
      }
      else if(bullet.target === "myShip"){
        bullet.crashWith(myShip);
      }
      bullet.update();
    });
  }
}

function Spark(cx, cy, speedX, speedY){
  this.cx  = cx;
  this.cy = cy;
  this.gravity = .4;
  this.speedX = speedX;
  this.speedY = speedY;
  this.update = function(){
    if(this.cy > 1000){
      var sparkIndex = sparks.indexOf(this);
      sparks.splice(sparkIndex,1)
    }
    var ctx = myArea.context;
    ctx.shadowBlur = 5;
    ctx.fillStyle = "white";
    // ctx.shadowColor = "yellow"
    this.speedY += this.gravity;
    this.speedX *= .96;
    this.cx += this.speedX;
    this.cy += this.speedY;
    ctx.fillRect(this.cx, this.cy, 10, 10);
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

function fire(fireX){
  bullets.push(new Bullet(fireX +15, 690, -10, "invader"));
}

function alienFire(){
  if(myArea.frameNo % 100 === 0){
    var rando = Math.floor(Math.random() * invaders.length);
    var randoX = invaders[rando].cx +20;
    var randoY = invaders[rando].cy;
    bullets.push(new Bullet(randoX, randoY, 10 , "myShip"));
  }
}

myArea.start();
