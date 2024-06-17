let currentNumbers = [];
let pseudo = '';

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        setPseudo();
    }
}

function getRandomEmoji() {
    const emojis = ["🌴", "🐧", "⚡", "❤️", "😀", "😂", "😍", "😎", "😜", "🤔", "😴", "😭", "😱", "🤕", "🤑", "🤠", "😈", "👿", "💀", "👻", "👽", "💩"];
    const weights = [1/50, 1/200, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    let sum = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * sum;

    for (let i = 0; i < emojis.length; i++) {
        if (rand < weights[i]) {
            return emojis[i];
        }
        rand -= weights[i];
    }
    return emojis[0]; // Default emoji if something goes wrong
}

function setPseudo() {
    const input = document.getElementById('pseudo-input');
    pseudo = input.value;
    localStorage.setItem('pseudo', pseudo); // Store pseudo in localStorage
    const randomEmoji = getRandomEmoji();
    document.getElementById('pseudo-header').textContent = `Grille de ${pseudo} ${randomEmoji}`;
    document.getElementById('pseudo-header').style.display = 'block'; // Show pseudo header
    document.querySelector('.pseudo-input-container').style.display = 'none';
    document.getElementById('screenshot-button').style.display = 'flex'; // Show screenshot button
}

function updateTitleWithRandomEmoji() {
    const randomEmoji = getRandomEmoji();
    document.getElementById('pseudo-header').textContent = `Grille de ${pseudo} ${randomEmoji}`;
}

function generateBingoNumbers() {
    const ranges = [
        { min: 1, max: 15 },
        { min: 16, max: 30 },
        { min: 31, max: 45 },
        { min: 46, max: 60 },
        { min: 61, max: 75 }
    ];

    let columns = [];

    ranges.forEach(range => {
        let columnNumbers = [];
        while (columnNumbers.length < 5) {
            let num = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            if (!columnNumbers.includes(num)) {
                columnNumbers.push(num);
            }
        }
        columns.push(columnNumbers);
    });

    currentNumbers = columns;
    return columns;
}

function createBingoCard(columns) {
    const card = document.getElementById('bingo-card-container');
    card.innerHTML = ''; // Clear previous cells

    // Add pseudo header
    const pseudoHeader = document.createElement('div');
    pseudoHeader.classList.add('pseudo-header');
    pseudoHeader.id = 'pseudo-header';
    pseudoHeader.textContent = `Grille de ${pseudo}`;
    card.appendChild(pseudoHeader);

    // Add BINGO headers
    const headers = ['B', 'I', 'N', 'G', 'O'];
    headers.forEach(header => {
        const headerCell = document.createElement('div');
        headerCell.classList.add('bingo-header');
        headerCell.textContent = header;
        card.appendChild(headerCell);
    });

    const cells = [];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');
            cell.textContent = columns[col][row];
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => {
                cell.classList.toggle('checked');
                checkBingo(cells);
            });
            cells.push(cell);
            card.appendChild(cell);
        }
    }
}

function checkBingo(cells) {
    const rows = Array.from({ length: 5 }, () => 0);
    const cols = Array.from({ length: 5 }, () => 0);
    let diag1 = 0, diag2 = 0;

    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        if (cell.classList.contains('checked')) {
            rows[row]++;
            cols[col]++;
            if (row == col) diag1++;
            if (row == 4 - col) diag2++;
        }
    });

    let bingo = false;

    // Clear all previous bingo classes
    cells.forEach(cell => cell.classList.remove('bingo'));

    // Check rows
    rows.forEach((count, rowIndex) => {
        if (count === 5) {
            bingo = true;
            cells.forEach(cell => {
                if (cell.dataset.row == rowIndex) {
                    cell.classList.add('bingo');
                }
            });
        }
    });

    // Check columns
    cols.forEach((count, colIndex) => {
        if (count === 5) {
            bingo = true;
            cells.forEach(cell => {
                if (cell.dataset.col == colIndex) {
                    cell.classList.add('bingo');
                }
            });
        }
    });

    // Check diagonals
    if (diag1 === 5) {
        bingo = true;
        cells.forEach(cell => {
            if (cell.dataset.row == cell.dataset.col) {
                cell.classList.add('bingo');
            }
        });
    }

    if (diag2 === 5) {
        bingo = true;
        cells.forEach(cell => {
            if (cell.dataset.row == 4 - cell.dataset.col) {
                cell.classList.add('bingo');
            }
        });
    }

    document.getElementById('bingo-message').style.display = bingo ? 'block' : 'none';
    document.getElementById('controls').style.display = bingo ? 'block' : 'none';
}

function resetNewNumbers() {
    const pseudo = localStorage.getItem('pseudo');
    location.reload(); // Reload the page to get new numbers
    if (pseudo) {
        document.getElementById('pseudo-input').value = pseudo;
    }
}

function takeScreenshot() {
    const card = document.getElementById('bingo-card-container');
    html2canvas(card).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            alert("Vous venez de copier l'image de votre grille, vous avez juste à la coller (ctrl+v) dans le channel discord #bingo et l'envoyer à Chacalou (le crackito)");
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const columns = generateBingoNumbers();
    createBingoCard(columns);
    document.getElementById('screenshot-button').style.display = 'flex'; // Show the screenshot button initially
    const pseudo = localStorage.getItem('pseudo');
    if (pseudo) {
        document.getElementById('pseudo-input').value = pseudo;
    }
});
