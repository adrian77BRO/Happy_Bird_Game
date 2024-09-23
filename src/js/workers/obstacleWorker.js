let obstacles = [];
const obstacleSpacing = 200;
let lastObstacleX = 500;

function generateObstacle() {
    const minHeight = 100;
    const maxHeight = 400;
    const obstacleY = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    if (obstacles.length === 0 || (lastObstacleX - obstacles[obstacles.length - 1].x) > obstacleSpacing) {
        lastObstacleX += obstacleSpacing;
        obstacles.push({
            x: lastObstacleX,
            y: obstacleY,
            scored: false
        });
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;
        
        if (obstacle.x + 50 < 0) {
            obstacles.splice(index, 1);
        }
    });
    generateObstacle();
    postMessage(obstacles);
}

setInterval(updateObstacles, 20);