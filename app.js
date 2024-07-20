let boxes = document.querySelectorAll(".box");
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let timerDisplay = document.querySelector("#seconds");
let timerContainer = document.querySelector("#timer");

let turnO = true; // playerO, playerX
let btnClickCount = 0;
let timeLeft = 15;
let gameState = Array(9).fill("");

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const timer = (() => {
  let interval;

  const start = () => {
    clearTimeout(interval);
    timeLeft = 15;
    timerDisplay.innerText = timeLeft;
    timerContainer.style.background = "";
    interval = setInterval(() => {
      timeLeft--;
      timerDisplay.innerText = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
      if (timeLeft <= 5) {
        timerContainer.style.backgroundColor = "red";
      } else {
        timerContainer.style.backgroundColor = "";
      }
      if (timeLeft <= 0) {
        clearInterval(interval);
        const winner = turnO ? "X" : "O";
        showWinner(`Time out! Winner is ${winner}.`);
      }
    }, 1000);
  };

  const stop = () => {
    clearInterval(interval);
  };

  return { start, stop };
})();

const startGame = () => {
  startBtn.classList.add("hide");
  restartBtn.classList.remove("hide");
  timer.start();
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      if (turnO) {
        // playerO
        box.innerText = "O";
        gameState[index] = "O";
        turnO = false;
      } else {
        // playerX
        box.innerText = "X";
        gameState[index] = "X";
        turnO = true;
      }
      box.disabled = true;
      btnClickCount++;
      checkWinner();
      if (msgContainer.classList.contains("hide")) {
        timer.start();
      }
    });
  });
};

const restartGame = () => {
  timer.start();
  turnO = true;
  btnClickCount = 0;
  enableBoxes();
  gameState.fill("");
  msgContainer.classList.add("hide");
};

const disableBoxes = () => {
  for (box of boxes) {
    box.disabled = true;
  }
  timer.stop();
};

const enableBoxes = () => {
  for (box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  msg.innerText = winner;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const showDraw = () => {
  msg.innerText = "It's a Draw!";
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const checkWinner = () => {
  for (pattern of winPatterns) {
    let [pos1Val, pos2Val, pos3Val] = pattern;
    if (
      gameState[pos1Val] !== "" &&
      gameState[pos2Val] !== "" &&
      gameState[pos3Val] !== ""
    ) {
      if (
        gameState[pos1Val] === gameState[pos2Val] &&
        gameState[pos2Val] === gameState[pos3Val]
      ) {
        showWinner(`Congratulations! Winner is ${gameState[pos1Val]}`);
        return;
      }
    }
  }
  if (btnClickCount === 9) {
    showDraw();
  }
};

restartBtn.classList.add("hide");

newGameBtn.addEventListener("click", restartGame);
restartBtn.addEventListener("click", restartGame);
startBtn.addEventListener("click", startGame);

module.exports = {
  restartGame,
  disableBoxes,
  enableBoxes,
  showWinner,
  showDraw,
  checkWinner,
  startGame,
  timer,
};
