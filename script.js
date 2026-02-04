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

        let timer;
        let isLongPress = false;

        // 觸控開始
        cell.addEventListener('touchstart', (e) => {
            isLongPress = false;
            timer = setTimeout(() => {
                isLongPress = true;
                editingCell = cell;
                picker.classList.remove('hidden');
            }, 600); // 0.6秒判定為長按
        }, { passive: true });

        // 觸控結束
        cell.addEventListener('touchend', (e) => {
            if (timer) {
                clearTimeout(timer);
                // 如果不是長按，才執行「標記」功能
                if (!isLongPress) {
                    cell.classList.toggle('marked');
                    checkBingo();
                }
            }
            // 預防某些瀏覽器在 touchend 後還去觸發 click
            if (e.cancelable) e.preventDefault(); 
        });

        // 如果手指滑動了，就取消計時（代表使用者是在捲動網頁）
        cell.addEventListener('touchmove', () => {
            clearTimeout(timer);
        }, { passive: true });

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
