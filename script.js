const board = document.getElementById('bingo-board');

// 產生 25 個格子
for (let i = 1; i <= 25; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerText = i; // 或者你想讓使用者自己輸入數字
    
    // 點擊切換標記狀態
    cell.onclick = function() {
        this.classList.toggle('marked');
    };
    
    board.appendChild(cell);
}

function resetBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('marked'));
}
