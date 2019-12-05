function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function dist(x1, y1, x2, y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}
function getID() {
    return Math.floor(Math.random() * (999999999 - 111111111 + 1) + 111111111);
}
function getCirclePoint(x, y, radius, fi) {
    const k = Math.PI/180;
    const _x = parseFloat((radius * Math.cos(fi * k)).toFixed(4));
    const _y = parseFloat((radius * Math.sin(fi * k)).toFixed(4));

    return {x: x + _x, y: y + _y};
}

// Canvas
function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}