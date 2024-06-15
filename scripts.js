let currentNumbers = [];
let pseudo = '';

function setPseudo(event) {
    if (event.key === 'Enter') {
        pseudo = event.target.value;
        document.getElementById('bingo-title').textContent = `Grille de ${pseudo}`;
        event.target.style.display = 'none';
    }
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
    const card = document.getElementById('bingo-card');
    card.innerHTML = ''; // Clear previous cells
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
    document.getElementById('screenshot-button').style.display = bingo ? 'block' : 'none';
    document.getElementById('controls').style.display = bingo ? 'block' : 'none';
}

function resetSameNumbers() {
    createBingoCard(currentNumbers);
    document.getElementById('bingo-message').style.display = 'none';
    document.getElementById('screenshot-button').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
}

function resetNewNumbers() {
    const newNumbers = generateBingoNumbers();
    createBingoCard(newNumbers);
    document.getElementById('bingo-message').style.display = 'none';
    document.getElementById('screenshot-button').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
}

function takeScreenshot() {
    const container = document.getElementById('bingo-container');
    container.style.backgroundColor = '#000'; // Set background to black
    container.style.color = '#fff'; // Set text color to white
    html2canvas(container).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'bingo_screenshot.png';
        link.click();
    }).finally(() => {
        container.style.backgroundColor = ''; // Reset background color
        container.style.color = ''; // Reset text color
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const columns = generateBingoNumbers();
    createBingoCard(columns);
});
