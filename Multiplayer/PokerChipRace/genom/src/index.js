const MAX_LOOPS_COUNT = 300;
const LOOP_DELAY = 100; //0,1 second

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const W = new World();

let loops = 0;
let interval;
let chips = [];
let playerId = 1;

W.init();

function loop() { 
    let commands = [];
    const {yourChipsCount, allEntitiesCount, entities} = W.process();
    W.draw(context, canvas);

    const ents = entities.map((entityStr) => {
        const [id, playerId, radius, x, y, vx, vy] = entityStr.split(" ");
        const entity = new Entity(x, y, radius, playerId, id, vx, vy);

        return entity;
    });

    if (chips.length === 0) {
        chips = ents
            .filter((entity) => entity.playerId == playerId)
            .map((entity) => {
                const chip = new Chip(entity);
        
                return chip;
            });
    }

    for (let i = 0; i < chips.length; i++) {
        const cmd = chips[i].process(ents);
        if (cmd) {
            commands.push(cmd);
        }
    }

    W.commands(commands);
    loops++;

    //-----------------
    if (interval) {
        clearInterval(interval);
    }

    if (loops < MAX_LOOPS_COUNT && W.entitiesCount > 1) {
        interval = setInterval(function () {
            loop();
        }, LOOP_DELAY);
    }
}

loop();