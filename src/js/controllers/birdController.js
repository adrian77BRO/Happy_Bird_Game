const canvas = document.getElementById('gameCanvas');
let birdWorker;
let birdY = 250;
let birdVelocity;

export default {
    initialize() {
        birdWorker = new Worker('src/js/workers/birdWorker.js');
        birdWorker.onmessage = (e) => {
            birdY = e.data;
        };
    },

    jump() {
        birdWorker.postMessage('jump');
    },

    reset() {
        birdY = canvas.height / 2;
        birdVelocity = 0;

        if (birdWorker) {
            birdWorker.terminate();
        }
        birdWorker = new Worker('src/js/workers/birdWorker.js');
    },

    getBirdPosition() {
        return birdY;
    }
};
