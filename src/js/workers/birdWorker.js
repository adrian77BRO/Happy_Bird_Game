let gravity = 0.5;
let birdY = 250;
let velocity = 0;

self.onmessage = function(e) {
    if (e.data === 'jump') {
        velocity = -10;
    }
};

function updateBird() {
    velocity += gravity;
    birdY += velocity;
    self.postMessage(birdY);
    setTimeout(updateBird, 16);
}

updateBird();