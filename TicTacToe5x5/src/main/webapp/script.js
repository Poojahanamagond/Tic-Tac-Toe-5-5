const gameContainer = document.getElementById('game');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const playerXDisplay = document.getElementById('playerX');
const playerODisplay = document.getElementById('playerO');

const SIZE = 5; // 5x5 grid
const WIN_COUNT = 5; // must have 5 consecutive
let board = Array(SIZE * SIZE).fill("");
let currentPlayer = "X";
let isGameActive = true;

// Generate grid dynamically
for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    gameContainer.appendChild(cell);
}
const cells = document.querySelectorAll('.cell');

// Update player display
function updatePlayerDisplay() {
    if(currentPlayer === "X") {
        playerXDisplay.classList.add("active");
        playerODisplay.classList.remove("active");
    } else {
        playerXDisplay.classList.remove("active");
        playerODisplay.classList.add("active");
    }
}

// Floating win/draw
function showFloatingMessage(message) {
    const float = document.createElement('div');
    float.classList.add('floating');
    float.style.left = Math.random() * 80 + "%";
    float.textContent = message;
    document.body.appendChild(float);
    setTimeout(() => document.body.removeChild(float), 2000);
}

// Confetti
function createConfetti() {
    for(let i=0;i<30;i++){
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random()*100 + "%";
        confetti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
        confetti.style.animationDuration = 2 + Math.random()*2 + "s";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Handle click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');
    if(board[index] !== "" || !isGameActive) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkWinner();
}

// Check winner only for **consecutive 5**
function checkWinner() {
    const directions = [1, SIZE, SIZE+1, SIZE-1];

    for(let i=0; i<board.length; i++){
        if(board[i] === "") continue;

        for(let dir of directions){
            let consecutive = 1;
            let winningCells = [i];

            for(let step=1; step<WIN_COUNT; step++){
                const next = i + dir*step;

                // Check bounds for rows (to prevent wrap-around horizontally)
                if(dir === 1 && Math.floor(i/SIZE) !== Math.floor(next/SIZE)) break;
                if(dir === SIZE+1 && (Math.floor(i/SIZE) + step >= SIZE || (i%SIZE)+step >= SIZE)) break;
                if(dir === SIZE-1 && (Math.floor(i/SIZE)+step >= SIZE || (i%SIZE)-step < 0)) break;

                if(board[next] === board[i]){
                    consecutive++;
                    winningCells.push(next);
                } else break;
            }

            if(consecutive === WIN_COUNT){
                isGameActive = false;
                statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
                showFloatingMessage("🎉 WIN! 🎉");
                createConfetti();
                winningCells.forEach(idx => cells[idx].style.background="linear-gradient(45deg, #ff0, #0ff)");
                return;
            }
        }
    }

    if(!board.includes("")){
        statusText.textContent = "It's a Draw! 🤝";
        showFloatingMessage("🤝 DRAW!");
        createConfetti();
        isGameActive=false;
        return;
    }

    currentPlayer = currentPlayer==="X"?"O":"X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    updatePlayerDisplay();
}

// Reset
function resetGame(){
    board.fill("");
    isGameActive = true;
    currentPlayer = "X";
    cells.forEach(cell => {
        cell.textContent="";
        cell.style.background="";
    });
    statusText.textContent=`Player ${currentPlayer}'s Turn`;
    updatePlayerDisplay();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initialize
updatePlayerDisplay();
statusText.textContent=`Player ${currentPlayer}'s Turn`;
