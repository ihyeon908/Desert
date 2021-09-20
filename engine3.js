var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 400;
canvas.height = window.innerHeight - 300;

var bg = new Image();
bg.src = "backgroundimage.jpg";

//background
class Background {
  constructor() {
    this.x = 0,
    this.y = 0;
    this.w = 2000;
    this.h = 422;
    this.draw = function () {
      ctx.drawImage(bg, this.x--, this.y, this.w, this.h);
      if (this.x <= -500) {
        this.x = 0;
      }
    }
  }
}

var background = new Background();
background.draw();

//player variables
let gravity;
let gamespeed;
let walking = 0;
let frameIndex = 0;
const fps = 8;

var character = new Image();
character.src = "character.png";

//player
class Player {
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dy = 0;
    this.jumpForce = 13;
    this.originalHeight = h;
  }

  Animate() {
    //Jump
    if(keys['Space'] || keys['ArrowUp']) {
      frameIndex = 4;
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys['ArrowDown']) {
      frameIndex = 6;
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    //gravity
    if (this.y + this.h< 350) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = 350 - this.h;
    }

    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 13) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 42);
    }
  }

  Draw () {
    /*ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.w, this.h);*/
    ctx.drawImage(
      //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      character, 50 * frameIndex, 0, 50, 50, this.x, this.y , 50, 50
    );

    walking++;
    console.log(frameIndex);
    if (walking > fps) {
      frameIndex++;
      walking = 0;
    } 
    if (frameIndex >= 6) {
      frameIndex = 0;
    }
  }
}
var player = new Player(25, 350, 50, 50);
player.Draw();

var cactusimage = new Image();
cactusimage.src = 'cactus.png';

//cactus
class Cactus {
  constructor(){
    this.x = 1400;
    this.y = 300;
    this.width = 50;
    this.height = 50;
  }
  draw(){
    /*ctx.fillStyle = 'red';
    ctx.fillRect(this.x,this.y,this.width,this.height);*/
    ctx.drawImage(cactusimage, this.x, this.y, this.width,this.height);
  }
}
var cactus = new Cactus();
cactus.draw();

let flying = 0;

var birdimage = new Image();
birdimage.src = 'bird.png';

//birds
class Bird {
  constructor(){
    this.x = 1400;
    this.y = 250;
    this.width = 50;
    this.height = 50;
  }
  draw(){
    /*ctx.fillStyle = 'blue';
    ctx.fillRect(this.x,this.y,this.width,this.height);*/
    ctx.drawImage(
      birdimage, 50 * frameIndex, 0, 50, 50, this.x, this.y , 50, 50
    );

    flying++;
    if (flying > fps) {
      frameIndex++;
      flying = 0;
    } 
    if (frameIndex >= 5) {
      frameIndex = 0;
    }
  }
}
var bird = new Bird();
bird.draw();

//eventlisteners
let keys = {};
document.addEventListener('keydown', function(evt) {
  keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

//variables

var score;
var scoreText;
var highscore
var highscoreText;
var timer = 0;
var speed = 0;
var manycactus = [];
var manybirds = [];
var crouchtimer = 0;
var animation

//text
class Text {
  constructor (t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

//frame
function frame () {
  animation = requestAnimationFrame(frame);
  timer++;
  speed += 0.001;
  gamespeed = 3;
  gravity = 1;
  ctx.clearRect(0,0, canvas.width, canvas.height);
  background.draw();
  player.Animate();

  //cactusspawn
  function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  var spawntimer = RandomIntInRange(1,2) * 100;

  if (timer % spawntimer === 0) {
    var cactus = new Cactus();
    manycactus.push(cactus);
  }
  
  manycactus.forEach((c, i, o) => {
    if (c.x + c.width < 0) {
      o.splice(i, 1);
    }
    c.x -= (5 + speed);
    meet(player, c);
    c.draw();
  })

  //birdsspawn
  function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  var spawntimer = RandomIntInRange(1, 2) * 300;

  if (timer % spawntimer === 0) {
    var bird = new Bird();
    manybirds.push(bird);
  }
  
  manybirds.forEach((b, i, o) => {
    if (b.x + b.width < 0) {
      o.splice(i, 1);
    }
    b.x -= (5 + speed);
    meet(player, b);
    b.draw();
  })

  //score
  score = timer;
  //window.localStorage.setItem('highscore', 0);
  if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
  }

  scoreText = new Text("Score: " + score, 25, 25, "left", "#fff", "20");
  highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#fff", "20");

  scoreText.t = "Score: " + score;
  scoreText.draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Highscore: " + highscore;
  }

  highscoreText.draw();
} 

//when player, cactus meet
function meet(player, cactus) {
  if (player.x <= cactus.x + cactus.width &&
    player.x + player.w >= cactus.x &&
    player.y <= cactus.y + cactus.height &&
    player.y + player.h >= cactus.y) {
      window.localStorage.setItem('highscore', highscore);
      score = 0;
      cancelAnimationFrame(animation);
    }
}

//when player, birds meet
function meet(player, bird) {
  if (player.x <= bird.x + bird.width &&
    player.x + player.w >= bird.x &&
    player.y <= bird.y + bird.height &&
    player.y + player.h >= bird.y) {
      window.localStorage.setItem('highscore', highscore);
      score = 0;
      cancelAnimationFrame(animation);
    }
}

//when button clicked
function clearHighscore() {
  window.localStorage.setItem('highscore', 0);
}

frame();






