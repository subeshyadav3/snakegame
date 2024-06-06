const board = document.getElementById("gameBoard");
const printScore=document.getElementById("score");
const printHighScore=document.getElementById("highscore");

printHighScore.innerText="HighScore: "+ (localStorage.highScore>0?localStorage.highScore:"0");

//global variables
let width = 50;
let height = 26;
var x = 6,
  y = 10;
var tailX = [];
var tailY = [];
var tailSize = 0;
let foodX, foodY;
let fps = 15;
let score = 0;
let gameInterval;
let prevKey='';
function food() {
    
    foodX = Math.floor(Math.random() * height);
    foodY = Math.floor(Math.random() * width);
    for(let i=0;i<tailSize;i++){
        for(let j=0;j<tailSize;j++ ){
            if(foodX==tailX[i]&& foodY==tailY[j]){
                foodX = Math.floor(Math.random() * height);
                foodY = Math.floor(Math.random() * width);
            }
        }
        
    }
  
}

food();

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    const cell = document.createElement("div");
    cell.setAttribute('id', 'box');
    cell.setAttribute('x', i);
    cell.setAttribute('y', j);
    board.appendChild(cell);

  }
}

var currentKey = '';
addEventListener("keydown", (event) => {
  currentKey = event.key;
  
});



function gameLogic() {
 
  switch (currentKey) {
    case 'ArrowUp':
        if (prevKey !== 'ArrowDown') {
            prevKey = 'ArrowUp'; 
        }
        break;
    case 'ArrowDown':
        if (prevKey !== 'ArrowUp') {
            prevKey = 'ArrowDown'; 
        }
        break;
    case 'ArrowLeft':
        if (prevKey !== 'ArrowRight') {
            prevKey = 'ArrowLeft'; 
        }
        break;
    case 'ArrowRight':
        if (prevKey !== 'ArrowLeft') {
            prevKey = 'ArrowRight'; 
        }
        break;
    case 'x':
        clearInterval(gameInterval); // Stop the game loop
        window.location.reload(); // Refresh the page
        break;
  }

  // Update head position based on the direction

  
  
  switch (prevKey) {
    
  case 'ArrowUp':
        x--;
        break;
    case 'ArrowDown':
        x++;
        break;
    case 'ArrowLeft':
        y--;
        break;
    case 'ArrowRight':
        y++;
        break;
  }


  //fixing tail render issues
  function tail( tempX,tempY){
        for(let i=0;i<tailSize;i++){
            if(tempX==tailX[i] && tempY==tailY[i]){
                return true;
            }
        }
  }

  // Render the game board
  for (let cell of board.childNodes) {
    let tempX = parseInt(cell.getAttribute('x'));
    let tempY = parseInt(cell.getAttribute('y'));
    cell.setAttribute('id', 'box');
    if (tempX == x && tempY == y) {
      cell.setAttribute('id', 'head');
    } else if (tail(tempX,tempY)) {
      cell.setAttribute('id', 'tail');

    } else if (tempX == foodX && tempY == foodY) {
      cell.setAttribute('id', 'food');

    } else {
      cell.setAttribute('id', 'box');
    }
  }
  //check head collision with tail
  for (let k = 0; k < tailSize; k++) {
    if (x == tailX[k] && y == tailY[k]) {
      clearInterval(gameInterval); // Stop the game loop
      gameOver();
      return; // Exit the function early
    }
  }

  // Update tail positions
  if (tailSize >= 1) {
    let prevTailX = tailX[0];
    let prevTailY = tailY[0];
    let prev2TailX, prev2TailY;
    tailX[0] = x;
    tailY[0] = y;

    for (let i = 1; i < tailSize; i++) {
      prev2TailX = tailX[i];
      prev2TailY = tailY[i];
      tailX[i] = prevTailX;
      tailY[i] = prevTailY;
      prevTailX = prev2TailX;
      prevTailY = prev2TailY;
    }
  }

  //check if eaten food or not
  if (x == foodX && y == foodY) {
    food(); //new food
    
    score++;
    
    tailSize++;
    // fps += 2; // Increase game speed
  }

  printScore.innerText="Your Score:  "+ score;
  
  
  
  if (x == -1 || x == height || y == -1 || y == width) {
   
    gameOver();
  }
}

function gameOver() {
 
 checkHighScore(score);

 window.location.reload();
}



// save previous highscore and update if exceeded user's score 
function checkHighScore(score){
  //initialize highscore for local 
  
let highScore=localStorage.getItem("highScore");
if(highScore){
  highScore=parseInt(highScore);
}
else{
  highScore=0;
}


  //check for new highscore
  if(score>highScore){
    alert("You Secure a new high score");
    highScore=score;
    localStorage.setItem("highScore",highScore);
  }
 
}


function gameLoop() {
  gameInterval = setInterval(gameLogic, 1000 / fps);
}

gameLoop();

