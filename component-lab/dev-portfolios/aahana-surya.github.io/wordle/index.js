let answer = "";
let currentRow = 0, currentCol = 0, gameOver = false;
const grid = Array.from({ length: 6 }, () => Array(5).fill(""));

// 1. FETCH A COMMON WORD from the Datamuse API before the game starts
const API = "https://api.datamuse.com/words";
const START_LETTERS = "abcdefghilmnoprstw";

async function initGame() {
  answer = "";
  showMsg("Loading word...");
  try {
    // random first letter keeps answers varied; md=f adds word frequency
    const first = START_LETTERS[Math.floor(Math.random() * START_LETTERS.length)];
    const res = await fetch(`${API}?sp=${first}????&md=f&max=1000`);
    const data = await res.json();
    const common = data
      .filter(w => /^[a-z]{5}$/.test(w.word) && !/[^s]s$/.test(w.word)) // no plurals
      .filter(w => parseFloat(w.tags[0].slice(2)) >= 5);
    const pick = common[Math.floor(Math.random() * common.length)];
    answer = pick.word.toUpperCase();
    showMsg("");
  } catch (e) {
    showMsg("Failed to load word. Refresh page.");
  }
}

// 2. BUILD BOARD array
const board = document.getElementById("board");
const tiles = [];
for (let r = 0; r < 6; r++) {
  const row = document.createElement("div");
  row.className = "row";
  const rowTiles = [];
  for (let c = 0; c < 5; c++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    row.appendChild(tile);
    rowTiles.push(tile);
  }
  board.appendChild(row);
  tiles.push(rowTiles);
}

// 3. BUILD KEYBOARD
const keys = {};
const rows = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["Enter","z","x","c","v","b","n","m","⌫"]
];
const kb = document.getElementById("keyboard");
rows.forEach(rowKeys => {
  const rowEl = document.createElement("div");
  rowEl.className = "kb-row";
  rowKeys.forEach(k => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = k;
    btn.style.minWidth = k.length > 1 ? "56px" : "36px";
    btn.addEventListener("click", () => { handleKey(k); btn.blur(); });
    rowEl.appendChild(btn);
    keys[k.toUpperCase()] = btn;
  });
  kb.appendChild(rowEl);
});

// 4. HANDLE INPUT
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Enter") e.preventDefault(); // don't also "click" a focused key
  if (e.key === "Enter") handleKey("Enter");
  else if (e.key === "Backspace") handleKey("⌫");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key);
});

function handleKey(key) {
  if (gameOver || !answer || checking) return;
  
  const upperKey = key.toUpperCase();
  
  if (upperKey === "⌫" || upperKey === "BACKSPACE") {
    if (currentCol > 0) { 
      currentCol--; 
      grid[currentRow][currentCol] = ""; 
      tiles[currentRow][currentCol].textContent = ""; 
    }
  } else if (upperKey === "ENTER") {
    if (currentCol < 5) { showMsg("Not enough letters"); return; }
    submitGuess();
  } else if (currentCol < 5 && /^[A-Z]$/.test(upperKey)) {
    grid[currentRow][currentCol] = upperKey;
    tiles[currentRow][currentCol].textContent = upperKey;
    currentCol++;
  }
}

// 5. SUBMIT & VALIDATE via the Datamuse API
let checking = false;

async function isRealWord(word) {
  const res = await fetch(`${API}?sp=${word}&max=1`);
  const data = await res.json();
  // Datamuse fuzzy-matches, so only an exact hit counts
  return data.length > 0 && data[0].word === word;
}

async function submitGuess() {
  if (checking) return;
  const word = grid[currentRow].join("").toLowerCase();
  checking = true;
  showMsg("Checking...");
  try {
    if (!(await isRealWord(word))) { showMsg("Not a valid word!"); return; }
  } catch (e) {
    showMsg("Network error checking word");
    return;
  } finally {
    checking = false;
  }

  showMsg("");
  colorRow(word.toUpperCase());

  if (word.toUpperCase() === answer) {
    showMsg("🎉 You got it!");
    endGame();
  } else if (currentRow === 5) {
    showMsg(`Answer: ${answer}`);
    endGame();
  } else {
    currentRow++;
    currentCol = 0;
  }
}

function endGame() {
  gameOver = true;
  document.getElementById("play-again").hidden = false;
}

function resetGame() {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      grid[r][c] = "";
      tiles[r][c].textContent = "";
      tiles[r][c].className = "tile";
    }
  }
  Object.values(keys).forEach(k => { k.className = "key"; });
  currentRow = 0; currentCol = 0; gameOver = false;
  document.getElementById("play-again").hidden = true;
  showMsg("");
  initGame();
}

document.getElementById("play-again").addEventListener("click", e => {
  resetGame();
  e.currentTarget.blur();
});

// 6. COLOR TILES (Fixed key overwrite bug)
function colorRow(guess) {
  const answerArr = answer.split("");
  const result = Array(5).fill("absent");
  const used = Array(5).fill(false);

  // Green pass
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answerArr[i]) { 
      result[i] = "correct"; 
      used[i] = true; 
    }
  }
  // Yellow pass
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === answerArr[j]) { 
        result[i] = "present"; 
        used[j] = true; 
        break; 
      }
    }
  }

  result.forEach((state, i) => {
    tiles[currentRow][i].classList.add(state);
    const k = keys[guess[i]];
    if (k) {
      // Only upgrade key color, never downgrade
      if (state === "correct") {
        k.className = "key correct";
      } else if (state === "present" && !k.classList.contains("correct")) {
        k.className = "key present";
      } else if (state === "absent" && !k.classList.contains("correct") && !k.classList.contains("present")) {
        k.className = "key absent";
      }
    }
  });
}

function showMsg(msg) { document.getElementById("message").textContent = msg; }

// Start the game initialization
initGame();
