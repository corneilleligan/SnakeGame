const gameOverScreen = document.querySelector('.game-over');
const finalScoreText = document.querySelector('#final-score');
const restartBtn     = document.querySelector('#restart');
const playBoard      = document.querySelector('.play-board');
const scoreElement   = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const ctrlBtns       = document.querySelectorAll('.ctrl-btn');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let touchStartX = 0;
let touchStartY = 0;

let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `Meilleur : ${highScore}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  finalScoreText.innerText = `Score final : ${score}`;
  gameOverScreen.style.display = 'flex';
};

const changeDirection = e => {
  if (e.key === 'ArrowUp'    && velocityY !==  1) { velocityX = 0;  velocityY = -1; }
  else if (e.key === 'ArrowDown'  && velocityY !== -1) { velocityX = 0;  velocityY =  1; }
  else if (e.key === 'ArrowLeft'  && velocityX !==  1) { velocityX = -1; velocityY =  0; }
  else if (e.key === 'ArrowRight' && velocityX !== -1) { velocityX =  1; velocityY =  0; }
};

// Keyboard
document.addEventListener('keydown', changeDirection);

// Mobile buttons
ctrlBtns.forEach(btn => {
  btn.addEventListener('click', () => changeDirection({ key: btn.dataset.key }));
});

// Touch swipe
playBoard.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

playBoard.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    changeDirection({ key: dx > 0 ? 'ArrowRight' : 'ArrowLeft' });
  } else {
    changeDirection({ key: dy > 0 ? 'ArrowDown' : 'ArrowUp' });
  }
}, { passive: true });

const initGame = () => {
  if (gameOver) return handleGameOver();

  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem('high-score', highScore);
    scoreElement.innerText   = `Score : ${score}`;
    highScoreElement.innerText = `Meilleur : ${highScore}`;
  }

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);

restartBtn.addEventListener('click', () => location.reload());