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

const birdImg = new Image();
birdImg.src = 'src/assets/bird.png';

const obstacleImg = new Image();
obstacleImg.src = 'src/assets/wall.jpg';

const backgroundImg = new Image();
backgroundImg.src = 'src/assets/field.jpg';

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && gameStarted) {
        birdWorker.postMessage('jump');
    }
});

function checkScore() {
    obstacles.forEach(obs => {
        if (obs.x + 100 < 100 && !obs.scored) {
            score++;
            obs.scored = true;
        }
    });
}

function render() {
    if (gameOver) {
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText('¡Perdiste! :(', 360, 225);
        ctx.fillText('Puntaje: ' + score, 365, 275);
        restartButton.style.display = 'block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(birdImg, 100, birdY, 40, 40);

    ctx.fillStyle = 'green';
    obstacles.forEach(obs => {
        ctx.drawImage(obstacleImg, obs.x, 0, 70, obs.y - 125);
        ctx.drawImage(obstacleImg, obs.x, obs.y, 70, canvas.height - obs.y);
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