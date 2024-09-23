let obstacleWorker;
let obstacles = [];
let lastObstacleX;

export default {
    initialize() {
        obstacleWorker = new Worker('src/js/workers/obstacleWorker.js');
        obstacleWorker.onmessage = (e) => {
            obstacles = e.data;
        };
    },

    getObstacles() {
        return obstacles;
    },

    reset() {
        obstacles = [];
        lastObstacleX = 500;
        if (obstacleWorker) {
            obstacleWorker.terminate();
        }
        obstacleWorker = new Worker('src/js/workers/obstacleWorker.js');
        obstacleWorker.postMessage({ reset: true });
    }
};