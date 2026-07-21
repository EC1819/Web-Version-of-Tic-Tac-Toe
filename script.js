const board = document.getElementById('game-board');
const status = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (cell.textContent !== "") {
            return;
        }
        cell.textContent = "X";
    });
});