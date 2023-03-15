let backgroundImage; //background image
let charmander;
let canvas; //canvas declaration
let player = { x: 600, y: 380, w: 60, h: 70 };
let charmanderGoingLeft = false; // to check if going left
let charmanderGoingRight = false; // to check if going right
let jump = false; // to check if jumping
let jumpCounter = 0; // to keep track of jumping and make him fall
let banana;
let strawberry;
let pineapple;
let fruitsArray = [];
let healthBar = 50;
let gameOver;
let squirtle;
let waterColorB = 180;
let waterColorG = 200;
let water = { x: 105, y: 380, w: 30, h: 30 };
let highScoreArr = [0];
let highScore = 0;
let pokemonMusic;
let fruitsSound;
let gameOverSound;

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
  document.getElementById("restart-button").onclick = () => {
    gameOver.style.display = "none";
    healthBar = 50;
    water.x = 185;
    player = { x: 600, y: 380, w: 60, h: 70 };
    fruitsArray = [
      { img: banana, x: random(80, 650), y: -200, w: 50, h: 50 },
      { img: strawberry, x: random(80, 650), y: -400, w: 50, h: 50 },
      { img: pineapple, x: random(80, 650), y: 0, w: 50, h: 50 },
    ];
    startGame();
  };

  function startGame() {
    let mainScreen = document.getElementById("main-menu");
    mainScreen.style.display = "none";
    loop();
    canvas.show();
    pokemonMusic.play();
    pokemonMusic.loop();
  }
};

function preload() {
  backgroundImage = loadImage("images/lab-game-background.webp");
  charmander = loadImage("images/charmander.png");
  charmeleon = loadImage("images/charmeleon.png");
  charizard = loadImage("images/charizard.jpg");
  banana = loadImage("images/banana.png");
  strawberry = loadImage("images/strawberry.png");
  pineapple = loadImage("images/Pineapple.png");
  squirtle = loadImage("images/squirtle.png");
  pokemonMusic = createAudio("sounds/background-music.mp3");
  fruitsSound = createAudio("sounds/eat.wav");
  gameOverSound = loadSound("sounds/game-over.wav");
}

function setup() {
  noLoop();
  canvas = createCanvas(700, 450);
  canvas.hide();
  fruitsArray = [
    { img: banana, x: random(80, 650), y: -200, w: 50, h: 50 },
    { img: strawberry, x: random(80, 650), y: -400, w: 50, h: 50 },
    { img: pineapple, x: random(80, 650), y: 0, w: 50, h: 50 },
  ];
}

function draw() {
  //background Image
  image(backgroundImage, 0, 0, 700, 480);
  image(squirtle, 0, 370, 80, 90);

  //highscore
  textSize(20);
  fill(0, 200, 0);
  text(`Score: ${highScore}`, 580, 50);

  //water animation
  waterColorB++;
  waterColorG++;
  if (waterColorB >= 255) {
    waterColor = 180;
  }
  if (waterColorG >= 230) {
    waterColorG = 200;
  }

  fill(156, waterColorG, waterColorB);
  triangle(60, 400, 120, 380, 120, 420);

  rect(water.x, water.y, water.w, water.h);
  water.x += 2;
  if (water.x > 700) {
    water.x = 185;
  }

  //player Charmander
  if (healthBar < 60) {
    image(charmander, player.x, player.y, player.w, player.h);
  } else if (healthBar < 100) {
    image(charmeleon, player.x, player.y - 10, player.w + 10, player.h + 10);
  } else {
    image(charizard, player.x, player.y - 20, player.w + 20, player.h + 20);
  }

  //drawing health bar
  strokeWeight(0);
  fill(0, 200, 0);
  rect(20, 20, healthBar, 20);

  for (let i = 0; i < fruitsArray.length; i++) {
    image(
      fruitsArray[i].img,
      fruitsArray[i].x,
      fruitsArray[i].y,
      fruitsArray[i].w,
      fruitsArray[i].h
    );
    fruitsArray[i].y += 2;
  }

  //reset the fruits again to top of the screen
  fruitsArray.forEach((elem) => {
    if (elem.y > 480) {
      elem.y = -20;
      elem.x = random(80, 650);
    }
  });

  //gravity call so that player falls
  gravity();

  //Charmander going right and left
  if (charmanderGoingRight && player.x < 620) {
    player.x += 4;
  }
  if (charmanderGoingLeft && player.x > 80) {
    player.x -= 4;
  }

  //collision with fruits(eating)
  if (collideRectangles() == true) {
    fruitsSound.play();
  }
  collideWater(); // this is another collision with water obstacles

  //Max health bar of 150
  if (healthBar >= 135) {
    if (healthBar >= 150) {
      healthBar = 150;
    }
    textSize(32);
    fill(255, 165, 0);
    text("I'm on fire!", 250, 50);
  }
  if (healthBar < 25) {
    textSize(32);
    fill(0, 30, 250);
    text("I'm starving!", 230, 50);
  }

  // Game Over
  if (healthBar <= 0 || collideWater() == true) {
    gameOverSound.play();
    highestScore = highScoreArr.sort((a, b) => b - a);
    document.getElementById(
      "highscore"
    ).innerText = `Highest Score is: ${highestScore[0]}`;
    noLoop();
    canvas.hide();
    pokemonMusic.stop();
    gameOver = document.getElementById("game-over");
    gameOver.style.display = "inline";
    highScore = 0;
  }
}

// Player to go right and left
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    charmanderGoingRight = true;
  }
  if (keyCode === LEFT_ARROW) {
    charmanderGoingLeft = true;
  }
  if (keyCode == UP_ARROW) {
    jump = true;
    jumpCounter += 1;
  }
}

//stop executing once key is released
function keyReleased() {
  charmanderGoingLeft = false;
  charmanderGoingRight = false;
  jump = false;
}

//gravity for jumping
function gravity() {
  if (player.y > 370) {
    jumpCounter = 0;
  }
  if (jump == true && player.y > 250 && jumpCounter < 1) {
    player.y -= 6;
  } else {
    if (player.y < 380) {
      player.y += 5;
      jump = false;
    }
  }
}

//function for eating fruits
function collideRectangles() {
  for (let i = 0; i < fruitsArray.length; i++) {
    if (
      player.x < fruitsArray[i].x + fruitsArray[i].w &&
      player.x + player.w > fruitsArray[i].x &&
      player.y < fruitsArray[i].y + fruitsArray[i].h &&
      player.y + player.h > fruitsArray[i].y
    ) {
      fruitsArray[i].y = -20;
      fruitsArray[i].x = random(80, 650);
      healthBar += 30;
      highScore++;
      highScoreArr.push(highScore);
      return true;
    }
  }
  healthBar -= 0.1;
  return false;
}

//collide with Water
function collideWater() {
  if (
    player.x < water.x + water.w &&
    player.x + player.w > water.x &&
    player.y < water.y + water.h &&
    player.y + player.h > water.y
  ) {
    return true;
  } else if (player.x < 120 && player.y > 380) {
    return true;
  } else {
    return false;
  }
}
