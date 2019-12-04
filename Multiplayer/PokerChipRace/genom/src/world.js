const WIDTH = 800;
const HEIGHT = 515;
const CHIPS_MAX_COUNT = 6; // 1..6
const CHIPS_RADIUS_MIN = 25;
const CHIPS_RADIUS_MAX = 50;
const DROPLETS_COUNT_MIN = 10;
const DROPLETS_COUNT_MAX = 30;
const DROPLET_RADIUS_MIN = 10;
const DROPLET_RADIUS_MAX = 25;
const COLOR_MAP = {
    "-1": "#999",
    "1": "#f90"
}

class World {
    constructor(map) {
        this._entities = []; 
    }

    get entities() {
        return this._entities;
    }

    get entitiesCount() {
        return this._entities.length;
    }

    init() {
        // add chips
        const chipsCount = getRandomInt(1, CHIPS_MAX_COUNT);

        for (let i = 0; i < chipsCount; i++) {
            const radius = getRandomInt(CHIPS_RADIUS_MIN, CHIPS_RADIUS_MAX);
            const x = getRandomInt(0 + radius, WIDTH - radius);
            const y = getRandomInt(0 + radius, HEIGHT - radius);

            this.addEntity(new Entity(x, y, radius, 1));
        }
        // add droplets
        const dropletsCount = getRandomInt(DROPLETS_COUNT_MIN, DROPLETS_COUNT_MAX);

        for (let i = 0; i < dropletsCount; i++) {
            const radius = getRandomInt(DROPLET_RADIUS_MIN, DROPLET_RADIUS_MAX);
            const x = getRandomInt(0 + radius, WIDTH - radius);
            const y = getRandomInt(0 + radius, HEIGHT - radius);

            this.addEntity(new Entity(x, y, radius));
        }
    }

    addEntity(entity) {
        this._entities.push(entity);
    }

    draw(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this._entities.map((entity) => {
            if (entity) {
                drawCircle(context, entity.x, entity.y, entity.radius, COLOR_MAP[entity.playerId]);
            }
        });
    }

    process() {
        for (let i = this._entities.length - 1; i > -1; i--) {
            const entity = this._entities[i];

            // frame collisions
            if ((entity.x + entity.vx - entity.radius < 0) || (entity.x + entity.vx + entity.radius > WIDTH)) {
                entity.vx = entity.vx * -1;
            }
            if ((entity.y + entity.vy - entity.radius < 0) || (entity.y + entity.vy + entity.radius  >HEIGHT)) {
                entity.vy = entity.vy * -1;
            }

            entity.x += entity.vx;
            entity.y += entity.vy;

            // entities collisions
            for (let j = this._entities.length - 1; j > -1; j--) {
                const enemy = this._entities[j];
                if (entity.id === enemy.id || entity.radius === 0) {
                    continue;
                }
                const d = dist(entity.x, entity.y, enemy.x, enemy.y);

                if (enemy.radius > 0 && d < (entity.radius + enemy.radius)) {
                    if (entity.radius > enemy.radius) {
                        entity.swallow(enemy);
                        enemy.radius = 0;
                        this._entities[j] = enemy;
                    }
                }
                this._entities[i] = entity;
            }  
            
            this._entities = this._entities.filter((entity) => entity.radius > 0);
        }

        return {
            "yourChipsCount": this._entities.filter((entity) => entity.playerId === 1).length,
            "allEntitiesCount": this._entities.length,
            "entities": this._entities.map((entity) => [
                entity.id,
                entity.playerId,
                entity.radius,
                entity.x,
                entity.y,
                entity.vx,
                entity.vy
            ].join(' '))
        }
    }

    commands(cmds) {
        const chips = this._entities.filter((entity) => entity.playerId === 1);
        
        for (let i = 0; i < cmds.length; i++) {
            const cmd = cmds[i];
            const chip = chips[i];

            if (cmd === "WAIT") {
                continue;
            }

            const [x, y] = cmd.split(" ");

            console.log(x, y, chip);
        }

    }
}