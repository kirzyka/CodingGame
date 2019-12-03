const WIDTH = 800;
const HEIGHT = 515;
const PLAYERS_COUNT = 5; // 2..5
const CHIPS_MAX_COUNT = 6; // 1..6
const DROPLETS_COUNT_MIN = 10;
const DROPLETS_COUNT_MAX = 30;
const DROPLET_RADIUS_MIN = 10;
const DROPLET_RADIUS_MAX = 25;

class World {
    constructor(map) {
        this._entities = []; 
    }

    get entities() {
        return this._entities;
    }

    get playerId() {
        return this._playerId;
    }

    init() {
        this._playerId = getRandomInt(0, PLAYERS_COUNT - 1);

        // add chips
        for (let i = 0; i < PLAYERS_COUNT; i++) {

        }
        // add droplets
        const dropletsCount = getRandomInt(DROPLETS_COUNT_MIN, DROPLETS_COUNT_MAX);

        for (let i = 0; i < dropletsCount; i++) {
            const radius = getRandomInt(DROPLET_RADIUS_MIN, DROPLET_RADIUS_MAX);
            const x = getRandomInt(0 + radius, WIDTH - radius);
            const y = getRandomInt(0 + radius, HEIGHT - radius);

            this.addEntity(new Entity(x, y, radius));
        }

        console.log(this._entities);
    }

    addEntity(entity) {
        this._entities.push(entity);
    }

    draw(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this._entities.map((entity) => {
            if (entity) {
                drawCircle(context, entity.x, entity.y, entity.radius, '#999');
            }
        });
    }

    process() {
        for (let i = 0; i < this._entities.length; i++) {
            const entity = this._entities[i];

            if ((entity.x + entity.vx - entity.radius < 0) || (entity.x + entity.vx + entity.radius > WIDTH)) {
                entity.vx = entity.vx * -1;
            }
            if ((entity.y + entity.vy - entity.radius < 0) || (entity.y + entity.vy + entity.radius  >HEIGHT)) {
                entity.vy = entity.vy * -1;
            }

            entity.x += entity.vx;
            entity.y += entity.vy;
            this._entities[i] = entity;
        }
        //console.log(this._entities);
    }

    command() {

    }
}