export default {
    obstacles: [],

    addObstacle(x, y) {
        this.obstacles.push({ x, y, scored: false });
    }
};
