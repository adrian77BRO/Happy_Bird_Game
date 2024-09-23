const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

let birdWorker, obstacleWorker, collisionWorker;
let birdY = 250;
let obstacles = [];
let gameOver = false;
let gameStarted = false;
let score = 0;
let lastObstacleX = 500;

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && gameStarted) {
        birdWorker.postMessage('jump');
    }
});

function checkScore() {
    obstacles.forEach(obs => {
        if (obs.x + 50 < 100 && !obs.scored) {
            score++;
            obs.scored = true;
        }
    });
}

function render() {
    if (gameOver) {
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', 150, 300);
        ctx.fillText('Puntaje: ' + score, 150, 360);
        restartButton.style.display = 'block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(100, birdY, 20, 20);

    ctx.fillStyle = 'green';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, 0, 50, obs.y - 100);
        ctx.fillRect(obs.x, obs.y, 50, canvas.height - obs.y);
    });

    ctx.font = '24px sans-serif';
    ctx.fillText('Puntaje: ' + score, 20, 50);

    collisionWorker.postMessage({ birdY, obstacles });
    checkScore();
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    birdY = 250;
    obstacles = [];
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (birdWorker) birdWorker.terminate();
    if (obstacleWorker) obstacleWorker.terminate();
    if (collisionWorker) collisionWorker.terminate();

    birdWorker = new Worker('src/workers/birdWorker.js');
    obstacleWorker = new Worker('src/workers/obstacleWorker.js');
    collisionWorker = new Worker('src/workers/collisionWorker.js');

    birdWorker.onmessage = function (e) {
        birdY = e.data;
        render();
    };

    obstacleWorker.onmessage = function (e) {
        obstacles = e.data;
        render();
    };

    collisionWorker.onmessage = function (e) {
        if (e.data === true) {
            gameOver = true;
            render();
        }
    };
    render();
}

function restartGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    obstacles = [];
    score = 0;
    gameOver = false;
    lastObstacleX = 500;
    restartButton.style.display = 'none';
    obstacleWorker.postMessage({ reset: true });
    startGame();
}

startButton.addEventListener('click', startGame);

restartButton.addEventListener('click', restartGame);