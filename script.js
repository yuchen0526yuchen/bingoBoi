const board = document.getElementById('bingo-board');
const lineCountDisplay = document.getElementById('line-count');
const picker = document.getElementById('number-picker');
const pickerGrid = document.getElementById('picker-grid');
let cells = [];
let editingCell = null;

// 初始化：建立 5x5 格子與 1-100 選擇器
function init() {
    // 建立 1-100 數字按鈕
    for (let i = 1; i <= 75; i++) {
        const btn = document.createElement('div');
        btn.className = 'num-btn';
        btn.innerText = i;
        btn.onclick = () => {
            if (editingCell) {
                editingCell.innerText = i;
                closePicker();
                checkBingo();
            }
        };
        pickerGrid.appendChild(btn);
    }

    // 建立 25 格
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerText = i + 1;

        // 短按：標記
        cell.onclick = () => {
            cell.classList.toggle('marked');
            checkBingo();
        };

        // 長按：更換數字 (手機端)
        cell.oncontextmenu = (e) => {
            e.preventDefault();
            editingCell = cell;
            picker.classList.remove('hidden');
        };

        board.appendChild(cell);
        cells.push(cell);
    }
}

function closePicker() {
    picker.classList.add('hidden');
    editingCell = null;
}

function checkBingo() {
    let lines = 0;
    const marked = cells.map(c => c.classList.contains('marked'));
    const check = (indices) => indices.every(i => marked[i]);

    for (let i = 0; i < 5; i++) {
        if (check([i*5, i*5+1, i*5+2, i*5+3, i*5+4])) lines++; // 橫
        if (check([i, i+5, i+10, i+15, i+20])) lines++; // 直
    }
    if (check([0, 6, 12, 18, 24])) lines++; // 斜
    if (check([4, 8, 12, 16, 20])) lines++; // 斜

    lineCountDisplay.innerText = lines;
}

function randomize() {
    let nums = Array.from({length: 100}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    cells.forEach((cell, i) => {
        cell.innerText = nums[i];
        cell.classList.remove('marked');
    });
    checkBingo();
}

function resetBoard() {
    cells.forEach(cell => cell.classList.remove('marked'));
    checkBingo();
}

init();
