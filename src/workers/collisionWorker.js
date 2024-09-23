self.onmessage = function(e) {
    let birdY = e.data.birdY;
    let obstacles = e.data.obstacles;
    let collision = false;
    
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        if (obs.x < 150 && obs.x > 100 && (birdY < obs.y - 100 || birdY > obs.y)) {
            collision = true;
            break;
        }
    }

    if (birdY > 550 || birdY < 0) {
        collision = true;
    }

    self.postMessage(collision);
};