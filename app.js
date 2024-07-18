let boxes = document.querySelectorAll(".box");
let restartBtn = document.querySelector("#restart-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // playerO, playerX
let btnClickCount = 0;
let timer;

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

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO) {
      // playerO
      box.innerText = "O";
      turnO = false;
    } else {
      // playerX
      box.innerText = "X";
      turnO = true;
    }
    box.disabled = true;
    btnClickCount++;
    checkWinner();
    if (msgContainer.classList.contains("hide")) {
      startTimer();
    }
  });
});

const startTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const winner = turnO ? "X" : "O";
    showWinner(`Time out! ${winner} wins the game.`);
  }, 15000);
};

const restartGame = () => {
  turnO = true;
  btnClickCount = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  clearTimeout(timer);
  startTimer();
};

const disableBoxes = () => {
  for (box of boxes) {
    box.disabled = true;
  }
  clearTimeout(timer);
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
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(`Congratulations! Winner is ${pos1Val}`);
        return;
      }
    }
  }
  if (btnClickCount === 9) {
    showDraw();
  }
};

newGameBtn.addEventListener("click", restartGame);
restartBtn.addEventListener("click", restartGame);

module.exports = {
  restartGame,
  disableBoxes,
  enableBoxes,
  showWinner,
  showDraw,
  checkWinner,
};
