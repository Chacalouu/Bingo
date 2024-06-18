let currentNumbers = [];
let pseudo = '';
let emojiIndex = 0;
const emojis = ["🌴", "🐧", "⚡", "❤️", "😀", "😂", "😍", "😎", "😜", "🤔", "😴", "😭", "😱", "🤕", "🤑", "🤠", "😈", "👿", "💀", "👻", "👽", "💩"];
let firstCellChecked = false;

function changeEmoji() {
    document.getElementById('emoji-container').textContent = emojis[emojiIndex];
    emojiIndex = (emojiIndex + 1) % emojis.length;
}
setInterval(changeEmoji, 200);

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
    document.getElementById('stats-title').textContent = `Stats ${pseudo}`;
    loadStats(); // Load stats when pseudo is set
    document.getElementById('stats-container').style.display = 'block'; // Show stats container
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
                if (!firstCellChecked) {
                    firstCellChecked = true;
                    incrementGamesPlayed();
                }
                cell.classList.toggle('checked');
                if (cell.textContent == '69') {
                    showMessage();
                }
                checkBingo(cells);
            });
            cells.push(cell);
            card.appendChild(cell);
        }
    }
}

function showMessage() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 2000);
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
    document.getElementById('controls').style.display = 'flex'; // Show controls on bingo

    if (bingo) {
        incrementGamesWon();
    }
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

function loginToGame() {
    document.getElementById('main-screen').style.display = 'flex';
}

function loadStats() {
    const gamesPlayed = localStorage.getItem(`${pseudo}_gamesPlayed`) || 0;
    const gamesWon = localStorage.getItem(`${pseudo}_gamesWon`) || 0;

    document.getElementById('games-played').textContent = gamesPlayed;
    document.getElementById('games-won').textContent = gamesWon;
}

function incrementGamesPlayed() {
    let gamesPlayed = localStorage.getItem(`${pseudo}_gamesPlayed`) || 0;
    gamesPlayed = parseInt(gamesPlayed) + 1;
    localStorage.setItem(`${pseudo}_gamesPlayed`, gamesPlayed);
    document.getElementById('games-played').textContent = gamesPlayed;
}

function incrementGamesWon() {
    let gamesWon = localStorage.getItem(`${pseudo}_gamesWon`) || 0;
    gamesWon = parseInt(gamesWon) + 1;
    localStorage.setItem(`${pseudo}_gamesWon`, gamesWon);
    document.getElementById('games-won').textContent = gamesWon;
}

function resetStats() {
    localStorage.setItem(`${pseudo}_gamesPlayed`, 0);
    localStorage.setItem(`${pseudo}_gamesWon`, 0);
    loadStats();
}

document.addEventListener('DOMContentLoaded', () => {
    const columns = generateBingoNumbers();
    createBingoCard(columns);
    document.getElementById('controls').style.display = 'flex'; // Always show controls
    const pseudo = localStorage.getItem('pseudo');
    if (pseudo) {
        document.getElementById('pseudo-input').value = pseudo;
    }

    setTimeout(loginToGame, 5000); // Automatically login to the game after 5 seconds
});
