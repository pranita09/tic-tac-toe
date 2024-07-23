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

const moveSets = {
  X: { moves: ["X1", "X2", "X3"], sizes: ["small", "medium", "large"] },
  O: { moves: ["O1", "O2", "O3"], sizes: ["small", "medium", "large"] },
};

let playerMoves = {
  X: { X1: 3, X2: 2, X3: 1 },
  O: { O1: 3, O2: 2, O3: 1 },
};

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
      let currentPlayer = turnO ? "O" : "X";
      let move = getMove(currentPlayer);
      if (move && canPlaceMove(box, move)) {
        box.innerText = move;
        box.classList.add(
          moveSets[currentPlayer].sizes[
            moveSets[currentPlayer].moves.indexOf(move)
          ]
        );
        gameState[index] = move;
        playerMoves[currentPlayer][move]--;
        turnO = !turnO;
        btnClickCount++;
        checkWinner();
        if (msgContainer.classList.contains("hide")) {
          timer.start();
        }
      }
    });
  });
};

const getMove = (player) => {
  let moves = moveSets[player].moves;
  for (let move of moves) {
    if (playerMoves[player][move] > 0) {
      return move;
    }
  }
  return null;
};

const canPlaceMove = (box, move) => {
  if (!box.innerText) return true;
  let currentMove = box.innerText;
  let currentPlayer = currentMove.charAt(0);
  let currentMoveSize = moveSets[currentPlayer].moves.indexOf(currentMove);
  let newMoveSize = moveSets[move.charAt(0)].moves.indexOf(move);
  return newMoveSize > currentMoveSize;
};

const restartGame = () => {
  timer.start();
  turnO = true;
  btnClickCount = 0;
  enableBoxes();
  gameState.fill("");
  playerMoves = {
    X: { X1: 3, X2: 2, X3: 1 },
    O: { O1: 3, O2: 2, O3: 1 },
  };
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
    box.classList.remove("small", "medium", "large");
  }
};

const showWinner = (winner) => {
  msg.innerText = winner;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const showDraw = () => {
  msg.innerText = "End of the moves. It's a Draw!";
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
        gameState[pos1Val].charAt(0) === gameState[pos2Val].charAt(0) &&
        gameState[pos2Val].charAt(0) === gameState[pos3Val].charAt(0)
      ) {
        setTimeout(
          showWinner(
            `Congratulations! Winner is ${gameState[pos1Val].charAt(0)}`
          ),
          10000
        );
        return;
      }
    }
  }
  if (btnClickCount === 12) {
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
  getMove,
  canPlaceMove,
};
