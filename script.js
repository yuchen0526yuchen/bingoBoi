const board = document.getElementById('bingo-board');
const lineCountDisplay = document.getElementById('line-count');
let cells = [];

function init() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        // 建立輸入框，讓使用者可以自訂數字
        const input = document.createElement('input');
        input.type = 'text';
        input.value = i + 1;
        input.onclick = (e) => e.stopPropagation(); // 防止點擊輸入框時觸發標記
        
        cell.appendChild(input);
        cell.onclick = () => {
            cell.classList.toggle('marked');
            checkBingo();
        };
        
        board.appendChild(cell);
        cells.push(cell);
    }
}

function checkBingo() {
    let lines = 0;
    const size = 5;
    const marked = cells.map(c => c.classList.contains('marked'));

    // 檢查橫線、直線
    for (let i = 0; i < size; i++) {
        // 橫線
        if (marked.slice(i*5, i*5+5).every(v => v)) lines++;
        // 直線
        if ([0,1,2,3,4].every(j => marked[i + j*5])) lines++;
    }
    // 檢查對角線
    if ([0,6,12,18,24].every(i => marked[i])) lines++;
    if ([4,8,12,16,20].every(i => marked[i])) lines++;

    lineCountDisplay.innerText = lines;
}

function randomize() {
    let nums = Array.from({length: 25}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    cells.forEach((cell, i) => {
        cell.querySelector('input').value = nums[i];
        cell.classList.remove('marked');
    });
    checkBingo();
}

function resetBoard() {
    cells.forEach(cell => {
        cell.classList.remove('marked');
        cell.querySelector('input').value = '';
    });
    checkBingo();
}

init();
