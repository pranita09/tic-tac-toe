const {
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
} = require("./app");

// Mock DOM elements for testing purposes
document.body.innerHTML = `
  <div>
    <button class="box" data-index="0"></button>
    <button class="box" data-index="1"></button>
    <button class="box" data-index="2"></button>
    <button class="box" data-index="3"></button>
    <button class="box" data-index="4"></button>
    <button class="box" data-index="5"></button>
    <button class="box" data-index="6"></button>
    <button class="box" data-index="7"></button>
    <button class="box" data-index="8"></button>
    <button id="start-btn" class="btn">Start Game</button>
    <button id="restart-btn" class="btn">Restart Game</button>
    <button id="new-btn" class="btn">New Game</button>
    <div class="msg-container hide">
      <p id="msg">New Game</p>
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
let timerContainer = document.querySelector("#timer");

describe("Upgraded Tic Tac Toe Game Tests", () => {
  beforeEach(() => {
    restartGame(); // Reset game state before each test
  });

  test("Initial game state", () => {
    expect(turnO).toBe(true);
    expect(btnClickCount).toBe(0);
    expect(timeLeft).toBe(15);
    expect(msgContainer.classList.contains("hide")).toBe(true);
    expect(timerDisplay.innerText).toBe("15");
  });

  test("Start game", () => {
    startGame();
    expect(startBtn.classList.contains("hide")).toBe(true);
    expect(restartBtn.classList.contains("hide")).toBe(false);

    boxes[0].click();
    expect(boxes[0].innerText).toBe("O3");

    // Simulate winning condition
    boxes[1].click();
    boxes[2].click();
    boxes[3].click();
    boxes[4].click();
    boxes[5].click();
    boxes[6].click();
    boxes[7].click();
    boxes[8].click();

    // to ensure game continues as expected
    expect(msgContainer.classList.contains("hide")).toBe(true);

    // winning move
    boxes[0].innerText = "O3";
    boxes[1].innerText = "O2";
    boxes[2].innerText = "O1";
    checkWinner();
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toBe("Congratulations! Winner is O");
  });

  test("Restart game", () => {
    startGame();
    boxes[0].innerText = "O3";
    boxes[1].innerText = "X3";
    boxes[2].innerText = "O2";
    restartGame();

    expect(turnO).toBe(true);
    expect(btnClickCount).toBe(0);
    expect(msgContainer.classList.contains("hide")).toBe(true);
    expect(boxes[0].innerText).toBe("");
    expect(timerDisplay.innerText).toBe("15");
  });

  test("Timer functionality", () => {
    jest.useFakeTimers();
    startGame();
    timer.start();

    jest.advanceTimersByTime(10000); // advance timer by 10 seconds
    expect(timeLeft).toBe(5); // time left after 10 seconds

    jest.advanceTimersByTime(6000); // advance timer by 6 seconds (total 16)
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toEqual(
      expect.stringContaining("Time out! Winner is X")
    );
    jest.useRealTimers();
  });

  test("Draw condition", () => {
    startGame();
    // draw condition
    boxes[0].innerText = "O3";
    boxes[1].innerText = "X3";
    boxes[2].innerText = "O2";
    boxes[3].innerText = "X2";
    boxes[4].innerText = "O1";
    boxes[5].innerText = "X1";
    boxes[6].innerText = "X3";
    boxes[7].innerText = "O3";
    boxes[8].innerText = "X2";
    btnClickCount = 12; // max moves reached

    checkWinner();
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toBe("End of the moves. It's a Draw!");
  });

  test("Disable and enable boxes", () => {
    disableBoxes();
    boxes.forEach((box) => {
      expect(box.disabled).toBe(true);
    });
    enableBoxes();
    boxes.forEach((box) => {
      expect(box.disabled).toBe(false);
    });
  });

  test("Can place move", () => {
    expect(canPlaceMove(boxes[0], "O3")).toBe(true); // empty box
    boxes[0].innerText = "O3";
    expect(canPlaceMove(boxes[0], "O2")).toBe(true); // larger move
    expect(canPlaceMove(boxes[0], "O1")).toBe(true); // largest move
    expect(canPlaceMove(boxes[0], "O3")).toBe(false); // same size move
    expect(canPlaceMove(boxes[0], "X3")).toBe(false); // smaller move
  });

  test("Get move", () => {
    expect(getMove("X")).toBe("X3");
    playerMoves.X.X3 = 0;
    expect(getMove("X")).toBe("X2");
    playerMoves.X.X2 = 0;
    expect(getMove("X")).toBe("X1");
    playerMoves.X.X1 = 0;
    expect(getMove("X")).toBe(null);

    expect(getMove("O")).toBe("O3");
    playerMoves.O.O3 = 0;
    expect(getMove("O")).toBe("O2");
    playerMoves.O.O2 = 0;
    expect(getMove("O")).toBe("O1");
    playerMoves.O.O1 = 0;
    expect(getMove("O")).toBe(null);
  });
});
