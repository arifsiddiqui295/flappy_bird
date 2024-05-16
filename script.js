let checkClick = true;
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0;
let gravity = 0.4;
let score = 0;
let gameOver = false;
window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  //draw flappy bird
  // context.fillStyle ="green"
  context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load Images
  birdImg = new Image();
  birdImg.src = "./images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
  };
  topPipeImg = new Image();
  topPipeImg.src = "./images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./images/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("click", moveBird);
};
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height); // Clear the canvas before drawing

  // Draw bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  if (bird.y > board.height) {
    gameOver = true;
  }
  // Draw pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    // Check if bird passed the pipe
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    // Check for collision
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // Clear pipes that are off-screen
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  // Draw score and game over message
  context.fillStyle = "white";
  context.font = "45px Arial";
  context.fillText(Math.floor(score), 5, 45);
  context.fillStyle = "white";
  context.font = "30px Arial";
  if (!gameOver && checkClick) {
    context.fillText("Click anywhere to Start", 5, 85);
  }
  if (gameOver) {
    context.fillText("Game Over, Click to Start ", 5, 90);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
  //   pipeX -= velocityX;
}

function moveBird() {
  checkClick = false;
  velocityY = -6;
  if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
