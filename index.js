const gameBoard = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const levelIndicator = document.getElementById('level');
let cards = [];
let flippedCards = [];
let matches = 0;
let level = 1;

// Initialize the game
function initGame() {
    // Retrieve saved level from localStorage
    const savedLevel = localStorage.getItem('memoryGameLevel');
    if (savedLevel) {
        level = parseInt(savedLevel, 10);
    } else {
        level = 1;
    }

    matches = 0;
    flippedCards = [];
    cards = generateCards(level);
    cards = shuffle(cards);
    gameBoard.innerHTML = '';
    const gridSize = Math.ceil(Math.sqrt(cards.length));
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    levelIndicator.textContent = level;

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = '?';

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = card;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Generate cards based on the level
function generateCards(level) {
    const cardValues = 'ABCDEFGH'.slice(0, level * 2);
    return [...cardValues, ...cardValues];
}

// Shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Flip the card
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Check for a match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matches += 1;
        flippedCards = [];
        if (matches === cards.length / 2) {
            setTimeout(nextLevel, 1000);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Proceed to the next level
function nextLevel() {
    level += 1;
    // Save the current level to localStorage
    localStorage.setItem('memoryGameLevel', level);
    initGame();
}

// Restart the game
restartButton.addEventListener('click', () => {
    level = 1;
    // Clear the saved level from localStorage
    localStorage.removeItem('memoryGameLevel');
    initGame();
});

// Start the game for the first time
initGame();
