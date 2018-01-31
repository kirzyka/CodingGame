var speed = parseInt(readline()); // the motorbike's speed.
var coordX = parseInt(readline()); // the position on the road of the motorbike.

var action = function(cmd) {
    printErr(cmd, coordX, speed, 'const: ', road, gap, platform);
    print(cmd);
}

if(coordX < road - 1) {
    if(speed < gap + 1) {
        action('SPEED');
    } else if(speed == gap + 1) {
        action('WAIT');
    } else {
        action('SLOW');
    }
} else if(coordX == road - 1) {
    action('JUMP');
} else if(coordX < road + gap - 1) {
    action('WAIT');
} else if(coordX < road + gap + platform - 2) {
    if(speed == 1) {
        action('WAIT');
    } else {
        action('SLOW');
    }
} else {
        