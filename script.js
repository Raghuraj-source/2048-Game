const SIZE = 4;
let grid = [];
let score = 0;
let bestScore = 0;

function initGrid() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    renderGrid();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === 0) {
                emptyCells.push([r, c]);
            }
        }
    }

    if (emptyCells.length > 0) {
        const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderGrid() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.textContent = grid[r][c] === 0 ? '' : grid[r][c];
            cell.className = 'grid-cell';
            if (grid[r][c] > 0) {
                cell.classList.add(`tile-${grid[r][c]}`);
            }
        }
    }
}

function slide(row) {
    let arr = row.filter(val => val);
    let missing = SIZE - arr.length;
    let zeros = Array(missing).fill(0);
    arr = zeros.concat(arr);
    for (let i = SIZE - 1; i >= 1; i--) {
        if (arr[i] === arr[i - 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i - 1] = 0;
        }
    }
    return arr.filter(val => val).concat(zeros);
}

function slideLeft() {
    for (let r = 0; r < SIZE; r++) {
        grid[r] = slide(grid[r]);
    }
}

function slideRight() {
    for (let r = 0; r < SIZE; r++) {
        grid[r] = slide(grid[r].reverse()).reverse();
    }
}

function slideUp() {
    for (let c = 0; c < SIZE; c++) {
        let row = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        row = slide(row);
        for (let r = 0; r < SIZE; r++) {
            grid[r][c] = row[r];
        }
    }
}

function slideDown() {
    for (let c = 0; c < SIZE; c++) {
        let row = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        row = slide(row.reverse()).reverse();
        for (let r = 0; r < SIZE; r++) {
            grid[r][c] = row[r];
        }
    }
}

function handleKey(e) {
  let moved = false;
  switch (e.key) {
      case 'ArrowLeft':
          moved = true;
          slideLeft();
          break;
      case 'ArrowRight':
          moved = true;
          slideRight();
          break;
      case 'ArrowUp':
          moved = true;
          slideUp();
          break;
      case 'ArrowDown':
          moved = true;
          slideDown();
          break;
  }
  if (moved) {
      addRandomTile();
      renderGrid();
      updateScore();
      if (isGameOver()) {
          bestScore = Math.max(bestScore, score);
          updateScore();
          alert("Game Over! Starting a new game...");
          initGrid(); 
          
          // Automatically start a new game


      }
  }
}


function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('best-score').textContent = bestScore;
}

function isGameOver() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === 0) return false;
            if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
            if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
        }
    }
    return true;
}

window.addEventListener('keydown', handleKey);
initGrid();
