const board = document.getElementById('game-board');
const status = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

let playerPositions = [];
let aiPositions = [];
let gameOver = false;

const winConditions = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]
];

function openSpots() {
    const spots = [];
    for (let i = 1; i <= 9; i++) {
        if (!playerPositions.includes(i) && !aiPositions.includes(i)) {
            spots.push(i);
        }
    }
    return spots;
}

function checkWin(positions, line) {
    return line.every(pos => positions.includes(pos));
}

function getStatus() {
    for (const line of winConditions) {
        if (checkWin(playerPositions, line)) {
            return "Player";
        }
        if (checkWin(aiPositions, line)) {
            return "AI";
        }
    }
    if (playerPositions.length + aiPositions.length === 9) {
        return "Draw";
    }
    return "";
}
function endGame(result) {
    gameOver = true;
    if (result === "Player") {
        status.textContent = "You win!";
    } else if (result === "AI") {
        status.textContent = "AI wins!";
    } else {
        status.textContent = "It's a draw!";
    }
}

function minimax(aiTurn, depth) {
    const result = getStatus();
    if (result === "Player") return -10 + depth;
    if (result === "AI") return 10 - depth;
    if (result === "Draw") return 0;

    let bestScore = aiTurn ? -Infinity : Infinity;

    for (const spot of openSpots()) {
        if (aiTurn) {
            aiPositions.push(spot);
        } else {
            playerPositions.push(spot);
        }

        const score = minimax(!aiTurn, depth + 1);

        if (aiTurn) {
            aiPositions.pop();
        } else {
            playerPositions.pop();
        }

        bestScore = aiTurn ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }
    return bestScore;
}

function bestMove() {
    let bestScore = -Infinity;
    let bestSpot = null;

    for (const spot of openSpots()) {
        aiPositions.push(spot);
        const score = minimax(false, 0);
        aiPositions.pop();

        if (score > bestScore) {
            bestScore = score;
            bestSpot = spot;
        }
    }
    return bestSpot;
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (gameOver) return;
        const spot = parseInt(cell.dataset.spot);
        if (playerPositions.includes(spot) || aiPositions.includes(spot)) return;

        playerPositions.push(spot);
        cell.textContent = "X";

        let result = getStatus();
        if (result !== "") {
            endGame(result);
            return;
        }

        const aiSpot = bestMove();
        aiPositions.push(aiSpot);
        const aiCell = document.querySelector(`.cell[data-spot="${aiSpot}"]`);
        aiCell.textContent = "O";

        result = getStatus();
        if (result !== "") {
            endGame(result);
        }
    });
});