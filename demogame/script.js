const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const newRecordElement = document.getElementById('newRecord');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

highScoreElement.textContent = highScore;

// Generate random food position
function randomFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            randomFood();
            return;
        }
    }
}

// Draw game elements
function drawGame() {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw snake with gradient
    snake.forEach((segment, index) => {
        const gradient = ctx.createRadialGradient(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            0,
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize / 2
        );

        if (index === 0) {
            // Head
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(1, '#2E7D32');
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);

            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 3, 3);
            ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 5, 3, 3);
        } else {
            // Body
            gradient.addColorStop(0, '#8BC34A');
            gradient.addColorStop(1, '#4CAF50');
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });

    // Draw food with pulsing effect
    const time = Date.now() * 0.005;
    const pulseSize = Math.sin(time) * 2 + gridSize - 4;
    const foodGradient = ctx.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2
    );
    foodGradient.addColorStop(0, '#FF5722');
    foodGradient.addColorStop(1, '#D32F2F');
    ctx.fillStyle = foodGradient;
    ctx.fillRect(
        food.x * gridSize + (gridSize - pulseSize) / 2,
        food.y * gridSize + (gridSize - pulseSize) / 2,
        pulseSize,
        pulseSize
    );
}

// Move snake
function moveSnake() {
    if (!gameRunning || gamePaused) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        randomFood();
    } else {
        snake.pop();
    }
}

// Game over function
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);

    finalScoreElement.textContent = score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
        newRecordElement.style.display = 'block';
    } else {
        newRecordElement.style.display = 'none';
    }

    gameOverElement.style.display = 'block';
}

// Start game
function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    gamePaused = false;
    gameOverElement.style.display = 'none';

    gameLoop = setInterval(() => {
        moveSnake();
        drawGame();
    }, 150);

    if (snake.length === 1 && dx === 0 && dy === 0) {
        dx = 1; // Start moving right
    }
}

// Toggle pause
function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;
    document.querySelector('.pause-btn').textContent = gamePaused ? 'Tiếp tục' : 'Tạm dừng';
}

// Reset game
function resetGame() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);

    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;

    randomFood();
    drawGame();

    gameOverElement.style.display = 'none';
    document.querySelector('.pause-btn').textContent = 'Tạm dừng';
}

// Change direction function
function changeDirection(direction) {
    if (!gameRunning || gamePaused) return;

    switch (direction) {
        case 'up':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'down':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'left':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'right':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameRunning) togglePause();
            else startGame();
        }
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection('down');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection('right');
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

// Initialize game
randomFood();
drawGame();

// Touch controls for mobile
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (touchStartX === null || touchStartY === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) changeDirection('right');
        else changeDirection('left');
    } else {
        if (deltaY > 0) changeDirection('down');
        else changeDirection('up');
    }

    touchStartX = null;
    touchStartY = null;
});