const {
  restartGame,
  disableBoxes,
  enableBoxes,
  showWinner,
  showDraw,
  checkWinner,
  startTimer,
  startGame,
} = require("./app");

// DOM elements for testing purposes
document.body.innerHTML = `
    <div>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button class="box"></button>
      <button id="start-btn" class="btn">Start Game</button>
      <button id="restart-btn" class="btn">Restart Game</button>
      <button id="new-btn" class="btn">New Game</button>
      <div class="msg-container hide">
        <p id="msg">New Game</p>
        <button id="new-btn" class="btn">New Game</button>
      </div>
      <div id="timer">
        <p id="seconds">15</p>
      </div>
    </div>
  `;

let boxes = document.querySelectorAll(".box");
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let timerDisplay = document.querySelector("#seconds");

describe("Tic Tac Toe Game Tests", () => {
  beforeEach(() => {
    restartGame(); // reset game state before each test
  });

  test("Initial game state", () => {
    expect(turnO).toBe(true);
    expect(btnClickCount).toBe(0);
    expect(timer).toBeUndefined();
    expect(timeLeft).toBe(15);
    expect(msgContainer.classList.contains("hide")).toBe(true);
    expect(timerDisplay.innerText).toBe("15");
  });

  test("Start game", () => {
    startGame();
    expect(startBtn.classList.contains("hide")).toBe(true);
    expect(restartBtn.classList.contains("hide")).toBe(false);

    boxes[0].click();
    expect(boxes[0].innerText).toBe("O");
    //  winning condition
    boxes[0].innerText = "O";
    boxes[1].innerText = "O";
    boxes[2].innerText = "O";
    checkWinner();
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toBe("Congratulations! Winner is O");
  });

  test("Restart game", () => {
    startGame();
    boxes[0].innerText = "O";
    boxes[1].innerText = "X";
    boxes[2].innerText = "O";
    restartGame();

    expect(turnO).toBe(true);
    expect(btnClickCount).toBe(0);
    expect(msgContainer.classList.contains("hide")).toBe(true);
    expect(boxes[0].innerText).toBe("");
    expect(timerDisplay.innerText).toBe("15");
  });

  test("Timer functionality", () => {
    startTimer();
    jest.advanceTimersByTime(10000); // advance timer by 10 seconds
    expect(timeLeft).toBe(5); // time left after 10 seconds

    jest.advanceTimersByTime(6000); // advance timer by 6 seconds (total 15)
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toEqual(expect.stringContaining("Time"));
  });

  test("Draw condition", () => {
    startGame();
    // draw condition
    boxes[0].innerText = "O";
    boxes[1].innerText = "X";
    boxes[2].innerText = "O";
    boxes[3].innerText = "X";
    boxes[4].innerText = "O";
    boxes[5].innerText = "X";
    boxes[6].innerText = "X";
    boxes[7].innerText = "O";
    boxes[8].innerText = "X";
    checkWinner();
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toEqual(expect.not.stringContaining("Winner"));
  });

  test("Disable boxes", () => {
    disableBoxes();
    boxes.forEach((box) => {
      expect(box.disabled).toBe(true);
    });
    enableBoxes();
    boxes.forEach((box) => {
      expect(box.disabled).toBe(false);
    });
  });
});
