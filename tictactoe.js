const cells = document.querySelectorAll("[data-cell]");
const resultElement = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const endGameBtn = document.getElementById("endGameBtn");
const historyList = document.getElementById("historyList");
const humanStartBtn = document.getElementById("humanStart");
const aiStartBtn = document.getElementById("aiStart");
const starterDiv = document.getElementById("starter");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let userSymbol = "X";
let aiSymbol = "O";
let knowledgeBase = {};
let history = [];
let starterChosen = false;

// Historial
function addMove(player, index) {
  history.push({ player, index });
  const li = document.createElement("li");
  li.textContent = `Jugador ${player} marcó en la casilla ${index + 1}`;
  historyList.appendChild(li);
}

function resetHistory() {
  history = [];
  historyList.innerHTML = "";
}

// Base de conocimiento
function loadKnowledgeBase() {
  const data = localStorage.getItem("ticTacToeAI");
  if (data) knowledgeBase = JSON.parse(data);
}

function saveKnowledgeBase() {
  localStorage.setItem("ticTacToeAI", JSON.stringify(knowledgeBase));
}

// Comprobar resultado
function checkResult() {
  const winningCombinations = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const [a,b,c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      const winner = board[a];
      resultElement.textContent = `¡Jugador ${winner} gana!`;
      return;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    resultElement.textContent = "¡Empate!";
  }
}

// Movimiento IA
function aiMove() {
  if (!gameActive) return;

  let move;
  const boardKey = board.join("");

  if (knowledgeBase[boardKey] !== undefined) {
    move = knowledgeBase[boardKey];
    console.log("Movimiento aprendido usado:", move);
  } else {
    const availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
    move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    knowledgeBase[boardKey] = move;
    console.log("Movimiento nuevo generado:", move);
    saveKnowledgeBase();
  }

  if (board[move] === "") {
    board[move] = aiSymbol;
    addMove(aiSymbol, move);
    currentPlayer = userSymbol;
    updateBoard();
    checkResult();
  }
}

// Click en celda
function handleCellClick(index) {
  if (!gameActive || board[index] !== "" || currentPlayer !== userSymbol) return;

  board[index] = userSymbol;
  addMove(userSymbol, index);
  currentPlayer = aiSymbol;
  updateBoard();
  checkResult();

  if (gameActive) setTimeout(aiMove, 500);
}

// Elegir quién inicia
function chooseStarter(player) {
  starterChosen = true;
  starterDiv.style.display = "none";
  if (player === "human") {
    userSymbol = "X";
    aiSymbol = "O";
    currentPlayer = userSymbol;
    updateBoard();
  } else {
    userSymbol = "O";
    aiSymbol = "X";
    currentPlayer = aiSymbol;
    updateBoard();
    setTimeout(aiMove, 500);
  }
}

// Reiniciar juego
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  resultElement.textContent = "";
  resetHistory();

  if (!starterChosen) {
    starterDiv.style.display = "block";
  } else {
    if (currentPlayer === aiSymbol) setTimeout(aiMove, 500);
  }

  updateBoard();
}

// Finalizar juego
function endGame() {
  gameActive = false;
  resultElement.textContent = "Juego finalizado";
}

// Actualizar tablero
function updateBoard() {
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    cell.classList.remove("x", "o");
    if (board[index] === "X") cell.classList.add("x");
    if (board[index] === "O") cell.classList.add("o");
  });
}

// Eventos
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleCellClick(index));
});

restartBtn.addEventListener("click", restartGame);
endGameBtn.addEventListener("click", endGame);
humanStartBtn.addEventListener("click", () => chooseStarter("human"));
aiStartBtn.addEventListener("click", () => chooseStarter("ai"));

// Inicializar
loadKnowledgeBase();
restartGame();
