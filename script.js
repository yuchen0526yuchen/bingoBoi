let cardCount = 0;
let editingInfo = { cardId: null, cellIdx: null };

function init() {
    initPicker();
    addNewCard(); // 預設先給一張
}

function initPicker() {
    const grid = document.getElementById('picker-grid');
    for (let i = 1; i <= 100; i++) {
        const btn = document.createElement('div');
        btn.className = 'num-btn';
        btn.innerText = i;
        btn.onclick = () => selectNumber(i);
        grid.appendChild(btn);
    }
}

function addNewCard() {
    cardCount++;
    const container = document.getElementById('cards-container');
    const cardId = `card-${Date.now()}`; // 產生唯一的 ID
    
    const cardHtml = `
        <div class="card" id="${cardId}">
            <div class="card-header">
                <strong>賓果卡 #${cardCount} | 連線: <span class="line-count">0</span></strong>
                <button class="delete-btn" onclick="deleteCard('${cardId}')">✕ 移除卡片</button>
            </div>
            <div class="board"></div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
    
    const board = document.querySelector(`#${cardId} .board`);
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerText = i + 1;
        setupCellEvents(cell, cardId, i);
        board.appendChild(cell);
    }
}

function setupCellEvents(cell, cardId, idx) {
    let timer;
    let isLongPress = false;

    cell.addEventListener('touchstart', () => {
        isLongPress = false;
        timer = setTimeout(() => {
            isLongPress = true;
            editingInfo = { cardId, cellIdx: idx, element: cell };
            document.getElementById('number-picker').classList.remove('hidden');
        }, 600);
    }, { passive: true });

    cell.addEventListener('touchend', (e) => {
        if (timer) {
            clearTimeout(timer);
            if (!isLongPress) {
                cell.classList.toggle('marked');
                checkBingo(cardId);
            }
        }
    });

    cell.addEventListener('touchmove', () => clearTimeout(timer));
    cell.onclick = () => { // 電腦版支援
        if (!isLongPress) {
            cell.classList.toggle('marked');
            checkBingo(cardId);
        }
    };
}

function selectNumber(num) {
    if (editingInfo.element) {
        editingInfo.element.innerText = num;
        closePicker();
        checkBingo(editingInfo.cardId);
    }
}

function closePicker() {
    document.getElementById('number-picker').classList.add('hidden');
    editingInfo = { cardId: null, cellIdx: null, element: null };
}

// 自動喊號邏輯
function callNumber() {
    const input = document.getElementById('call-input');
    const num = input.value;
    if (!num) return;

    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        if (cell.innerText === num) {
            cell.classList.add('marked');
            // 找到該格子所屬的卡片 ID 並重算連線
            const cardId = cell.closest('.card').id;
            checkBingo(cardId);
        }
    });
    input.value = '';
}

function checkBingo(cardId) {
    const card = document.getElementById(cardId);
    const cells = Array.from(card.querySelectorAll('.cell'));
    const marked = cells.map(c => c.classList.contains('marked'));
    let lines = 0;
    const check = (arr) => arr.every(i => marked[i]);

    for (let i = 0; i < 5; i++) {
        if (check([i*5, i*5+1, i*5+2, i*5+3, i*5+4])) lines++;
        if (check([i, i+5, i+10, i+15, i+20])) lines++;
    }
    if (check([0, 6, 12, 18, 24])) lines++;
    if (check([4, 8, 12, 16, 20])) lines++;

    card.querySelector('.line-count').innerText = lines;
}

function deleteCard(id) {
    const element = document.getElementById(id);
    if (element) {
        // 增加一個消失動畫的感覺（選配）
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        setTimeout(() => {
            element.remove();
        }, 200);
    }
}

function resetAll() {
    if(confirm("確定要重設所有卡片嗎？")) {
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('marked'));
        document.querySelectorAll('.line-count').forEach(l => l.innerText = '0');
    }
}

init();
