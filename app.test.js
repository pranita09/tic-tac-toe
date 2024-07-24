const {
  restartGame,
  disableBoxes,
  enableBoxes,
  showWinner,
  showDraw,
  checkWinner,
  startGame,
  timer,
  canPlaceMove,
  updatePieceCount,
  updateSelectedPiece,
  displayTurn,
  placeMove,
  gameEnded,
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
    <div id="player-piece-x" class="player">
      <div id="X1" value="X1">X1<span id="remaining-X1" class="piece-count">3</span></div>
      <div id="X2" value="X2">X2<span id="remaining-X2" class="piece-count">2</span></div>
      <div id="X3" value="X3">X3<span id="remaining-X3" class="piece-count">1</span></div>
    </div>
    <div id="player-piece-o" class="player">
      <div id="O1" value="O1">O1<span id="remaining-O1" class="piece-count">3</span></div>
      <div id="O2" value="O2">O2<span id="remaining-O2" class="piece-count">2</span></div>
      <div id="O3" value="O3">O3<span id="remaining-O3" class="piece-count">1</span></div>
    </div>
    <div class="turn"></div>
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
let playerPieces = document.querySelectorAll(".player div");
let turn = document.querySelector(".turn");

describe("Upgraded Tic Tac Toe Game Tests", () => {
  beforeEach(() => {
    restartGame(); // reset game state before each test
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
    expect(boxes[0].innerText).toBe("O1"); // default starting piece should be O1

    boxes[1].click();
    boxes[2].click();
    boxes[3].click();
    boxes[4].click();
    boxes[5].click();
    boxes[6].click();
    boxes[7].click();
    boxes[8].click();

    // to check game does not end early
    expect(msgContainer.classList.contains("hide")).toBe(true);

    // set up a winning condition
    boxes[0].innerText = "O1";
    boxes[1].innerText = "O2";
    boxes[2].innerText = "O3";
    checkWinner();
    expect(msgContainer.classList.contains("hide")).toBe(false);
    expect(msg.innerText).toBe("Congratulations! Winner is O");
  });

  test("Restart game", () => {
    startGame();
    boxes[0].innerText = "O1";
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
    // set up draw condition
    boxes[0].innerText = "O1";
    boxes[1].innerText = "X3";
    boxes[2].innerText = "O2";
    boxes[3].innerText = "X2";
    boxes[4].innerText = "O3";
    boxes[5].innerText = "X1";
    boxes[6].innerText = "X2";
    boxes[7].innerText = "O1";
    boxes[8].innerText = "X3";
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
    expect(canPlaceMove(boxes[0], "O1")).toBe(true); // empty box
    boxes[0].innerText = "O1";
    expect(canPlaceMove(boxes[0], "O2")).toBe(true); // larger move
    expect(canPlaceMove(boxes[0], "O3")).toBe(true); // largest move
    expect(canPlaceMove(boxes[0], "O1")).toBe(false); // same size move
    expect(canPlaceMove(boxes[0], "X3")).toBe(false); // different player
  });

  test("Update piece count", () => {
    playerMoves = {
      X: { X1: 2, X2: 1, X3: 0 },
      O: { O1: 1, O2: 2, O3: 0 },
    };
    updatePieceCount();
    expect(document.querySelector("#remaining-X1").innerText).toBe("2");
    expect(document.querySelector("#remaining-X2").innerText).toBe("1");
    expect(document.querySelector("#remaining-X3").innerText).toBe("0");
    expect(document.querySelector("#remaining-O1").innerText).toBe("1");
    expect(document.querySelector("#remaining-O2").innerText).toBe("2");
    expect(document.querySelector("#remaining-O3").innerText).toBe("0");
  });

  test("Update selected piece", () => {
    selectedMove.X = "X3";
    selectedMove.O = "O1";
    updateSelectedPiece();
    expect(document.querySelector(`#X3`).style.border).toBe("1px solid red");
    expect(document.querySelector(`#O1`).style.border).toBe("");
  });

  test("Prevent moves after game ends", () => {
    startGame();
    boxes[0].click();
    expect(turnO).toBe(false);
    showWinner("Congratulations! Winner is O");
    expect(gameEnded).toBe(true);

    boxes[1].click();
    expect(boxes[1].innerText).toBe(""); // should not change
  });

  test("Display turn message correctly", () => {
    displayTurn("O's Turn");
    expect(turn.innerText).toBe("O's Turn");

    // verify that the turn message disappears after 600ms
    jest.advanceTimersByTime(600);
    expect(turn.style.display).toBe("none");
  });

  test("Drag and drop move", () => {
    startGame();

    const dragStartEvent = new Event("dragstart");
    const dropEvent = new Event("drop");
    const dragOverEvent = new Event("dragover");

    playerPieces[0].dispatchEvent(
      new CustomEvent("dragstart", {
        dataTransfer: {
          setData: (type, value) => {
            this.value = value;
          },
        },
        bubbles: true,
        cancelable: true,
      })
    );

    playerPieces[0].dispatchEvent(dragStartEvent);

    const box = boxes[0];
    box.dispatchEvent(dragOverEvent);
    box.dispatchEvent(
      new CustomEvent("drop", {
        dataTransfer: { getData: () => "X1" },
        bubbles: true,
        cancelable: true,
      })
    );

    expect(box.innerText).toBe("X1");
  });
});
