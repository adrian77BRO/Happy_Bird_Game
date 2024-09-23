import birdController from './birdController.js';
import obstacleController from './obstacleController.js';
import gameView from '../views/gameView.js';

let birdWorker, obstacleWorker, collisionWorker;
let gameOver = false;
let score = 0;

export default {
    startGame() {
        gameOver = false;
        score = 0;
        let birdY = birdController.getBirdPosition();
        let obstacles = obstacleController.getObstacles();

        gameView.hideStartButton();
        gameView.hideRestartButton();
        gameView.clearCanvas();

        if (birdWorker) birdWorker.terminate();
        if (obstacleWorker) obstacleWorker.terminate();
        if (collisionWorker) collisionWorker.terminate();

        birdWorker = new Worker('src/js/workers/birdWorker.js');
        obstacleWorker = new Worker('src/js/workers/obstacleWorker.js');
        collisionWorker = new Worker('src/js/workers/collisionWorker.js');

        birdWorker.onmessage = (e) => {
            birdY = e.data;
            this.gameLoop(birdY, obstacles);
        };

        obstacleWorker.onmessage = (e) => {
            obstacles = e.data;
            this.gameLoop(birdY, obstacles);
        };

        collisionWorker.onmessage = (e) => {
            if (e.data === true) {
                gameOver = true;
                this.gameLoop(birdY, obstacles);
            }
        };
        this.gameLoop(birdY, obstacles);

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                birdWorker.postMessage('jump');
            }
        });
    },

    gameLoop(birdY, obstacles) {
        if (gameOver) {
            gameView.showGameOver(score);
            return;
        }
        gameView.render(birdY, obstacles, score);
        this.checkCollisions(birdY, obstacles);
    },

    checkCollisions(birdY, obstacles) {
        collisionWorker.postMessage({ birdY, obstacles });
        obstacles.forEach(obs => {
            if (obs.x + 100 < 100 && !obs.scored) {
                score++;
                obs.scored = true;
            }
        });
    },

    restartGame() {
        gameOver = false;
        score = 0;
        birdController.reset();
        obstacleController.reset();
        gameView.hideRestartButton();
        this.startGame();
    }
};