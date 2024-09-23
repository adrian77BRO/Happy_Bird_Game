const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const birdImg = new Image();
birdImg.src = 'src/assets/bird.png';

const obstacleImg = new Image();
obstacleImg.src = 'src/assets/wall.jpg';

const backgroundImg = new Image();
backgroundImg.src = 'src/assets/field.jpg';

export default {
    render(birdY, obstacles, score) {
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
    },

    clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    showGameOver(score) {
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText('¡Perdiste! :(', 360, 225);
        ctx.fillText('Puntaje: ' + score, 365, 275);
        restartButton.style.display = 'block';
    },

    hideStartButton() {
        startButton.style.display = 'none';
    },

    hideRestartButton() {
        restartButton.style.display = 'none';
    }
};
