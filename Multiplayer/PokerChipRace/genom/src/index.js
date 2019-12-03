const MAX_LOOPS_COUNT = 300;
const LOOP_DELAY = 100; //0,1 second

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const W = new World();

let loops = 0;
let interval;

W.init();
const playerId = W.playerId;


function loop() { 
    W.process();


    W.draw(context, canvas);
    loops++;

    //-----------------
    if (interval) {
        clearInterval(interval);
    }

    if (loops < MAX_LOOPS_COUNT) {
        interval = setInterval(function () {
            loop();
        }, LOOP_DELAY);
    }
}

loop();