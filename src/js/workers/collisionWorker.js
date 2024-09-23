self.onmessage = function (e) {
    const birdY = e.data.birdY;
    const obstacles = e.data.obstacles;
    const birdX = 100;
    const birdWidth = 20;
    const birdHeight = 20;

    let collision = false;

    obstacles.forEach(obs => {
        if (birdX + birdWidth > obs.x && birdX < obs.x + 50) {
            if (birdY < obs.y - 130) {
                collision = true;
            }
            if (birdY + birdHeight > obs.y) {
                collision = true;
            }

        }
    });

    if (birdY <= 0) {
        collision = true;
    }
    if (birdY + birdHeight >= 500) {
        collision = true;
    }
    self.postMessage(collision);
};