const { JSDOM } = require("jsdom");

// function to create the DOM structure
function setupDOM() {
  const dom = new JSDOM(`
    <div class="box" id="box-0"></div>
    <div class="box" id="box-1"></div>
    <div class="box" id="box-2"></div>
    <div class="box" id="box-3"></div>
    <div class="box" id="box-4"></div>
    <div class="box" id="box-5"></div>
    <div class="box" id="box-6"></div>
    <div class="box" id="box-7"></div>
    <div class="box" id="box-8"></div>
    <button id="restart-btn"></button>
    <button id="new-btn"></button>
    <div class="msg-container hide">
      <p id="msg"></p>
    </div>
  `);

  global.document = dom.window.document;
  global.window = dom.window;
}

beforeEach(() => {
  setupDOM();
  jest.resetModules(); // clear cache to reload the module with the new DOM
  require("./app.js");
});

describe("Tic Tac Toe Game Functions", () => {
  test("restartGame should reset the game state", () => {
    const { restartGame } = require("./app.js");
    const restartBtn = document.querySelector("#restart-btn");
    const boxes = Array.from(document.querySelectorAll(".box"));

    boxes.forEach((box) => {
      box.innerText = "O";
      box.disabled = true;
    });
    restartGame();

    boxes.forEach((box) => {
      expect(box.innerText).toBe("");
      expect(box.disabled).toBe(false);
    });

    const msgContainer = document.querySelector(".msg-container");
    expect(msgContainer.classList.contains("hide")).toBe(true);
  });

  test('computerMove should mark a box with "X"', () => {
    const { computerMove } = require("./app.js");
    const boxes = Array.from(document.querySelectorAll(".box"));
    boxes.forEach((box) => (box.innerText = ""));
    computerMove();
    const xBoxes = boxes.filter((box) => box.innerText === "X");
    expect(xBoxes.length).toBe(1);
  });

  test("disableBoxes should disable all boxes", () => {
    const { disableBoxes } = require("./app.js");
    disableBoxes();
    const boxes = Array.from(document.querySelectorAll(".box"));
    boxes.forEach((box) => {
      expect(box.disabled).toBe(true);
    });
  });

  test("enableBoxes should enable all boxes and clear their text", () => {
    const { enableBoxes } = require("./app.js");
    const boxes = Array.from(document.querySelectorAll(".box"));

    boxes.forEach((box) => {
      box.innerText = "X";
      box.disabled = true;
    });
    enableBoxes();

    boxes.forEach((box) => {
      expect(box.innerText).toBe("");
      expect(box.disabled).toBe(false);
    });
  });

  test("showWinner should display the winner message and disable boxes", () => {
    const { showWinner } = require("./app.js");
    const boxes = Array.from(document.querySelectorAll(".box"));
    showWinner("O");

    const msg = document.querySelector("#msg");
    expect(msg.innerText).toBe("Congratulations! Winner is O");

    const msgContainer = document.querySelector(".msg-container");
    expect(msgContainer.classList.contains("hide")).toBe(false);

    boxes.forEach((box) => {
      expect(box.disabled).toBe(true);
    });
  });

  test("showDraw should display the draw message and disable boxes", () => {
    const { showDraw } = require("./app.js");
    const boxes = Array.from(document.querySelectorAll(".box"));
    showDraw();

    const msg = document.querySelector("#msg");
    expect(msg.innerText).toBe("It's a Draw!");

    const msgContainer = document.querySelector(".msg-container");
    expect(msgContainer.classList.contains("hide")).toBe(false);

    boxes.forEach((box) => {
      expect(box.disabled).toBe(true);
    });
  });

  test("checkWinner should detect the winner correctly", () => {
    const { checkWinner } = require("./app.js");
    const boxes = Array.from(document.querySelectorAll(".box"));
    boxes[0].innerText = "O";
    boxes[1].innerText = "O";
    boxes[2].innerText = "O";
    checkWinner();

    const msg = document.querySelector("#msg");
    expect(msg.innerText).toBe("Congratulations! Winner is O");
  });

  test("checkWinner should detect a draw correctly", () => {
    const { checkWinner } = require("./app.js");
    const boxes = Array.from(document.querySelectorAll(".box"));
    const moves = ["O", "X", "O", "O", "X", "O", "X", "O", "X"];

    boxes.forEach((box, index) => {
      box.innerText = moves[index];
    });
    global.btnClickCount = 9;

    checkWinner();

    const msg = document.querySelector("#msg");
    expect(msg.innerText).not.toBe("Congratulations! Winner is O");
  });
});
