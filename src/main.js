import gameController from './js/controllers/gameController.js';

document.getElementById('startButton').addEventListener('click', () => {
    gameController.startGame();
});

document.getElementById('restartButton').addEventListener('click', () => {
    gameController.restartGame();
});