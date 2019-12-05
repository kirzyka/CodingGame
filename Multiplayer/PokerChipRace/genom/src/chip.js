const CHIP_GENOM_SIZE = 64;
const CHIP_COMMANDS_COUNT = 64;
const OBJ_TYPE_EMPTY = "E";
const OBJ_TYPE_ENEMY_T = "ET";
const OBJ_TYPE_ENEMY_D = "ED";
const OBJ_TYPE_DROPLET_T = "DT";
const OBJ_TYPE_DROPLET_D = "DD";
const OBJ_TYPE_WALL = "W";
const MOVES = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 }
];

class Chip {

    constructor(entity, genom) {
        this._entity = entity;
        this._genom = [];
        this._cmdPos = 0;

        if (!genom) {
            this._genom = [];
            for (let i = 0; i < CHIP_GENOM_SIZE; i++) {
                this._genom.push(getRandomInt(0, CHIP_COMMANDS_COUNT - 1)); // generate genom
            }
        } else {
            for (let i = 0; i < genom.length; i++) {
                this._genom.push(genom[i]); // copy genom
            }
        }
    }

    get genom() {
        return this._genom;
    }

    clone(withMutation) {
        const newChip = new Chip(this._genom);

        newChip.cmdPos = 0;

        if (withMutation) {
            newChip.mutation();
        }
        return newChip;
    }

    mutation() {
        const idx = getRandomInt(0, CHIP_GENOM_SIZE - 1);

        this._genom[idx] = getRandomInt(0, CHIP_COMMANDS_COUNT - 1);
    }

    process(entities) {
        let result = "WAIT";
        let stepCount = 0;
        const _entity = entities.find((entity) => entity.id === this._entity.id);

        if (!_entity) {
            return "";
        }

        this._entity.x = _entity.x;
        this._entity.y = _entity.y;
        this._entity.vx = _entity.vx;
        this._entity.vy = _entity.vy;
        this._entity.radius = _entity.radius;

        do {
            const cmd = this._genom[this._cmdPos];

            if (cmd === 0) { // wait   
                this.gotoCmdPos();
                stepCount = 10;            
            } else if (cmd < 9) { // move   
                // direction

                this.gotoCmdPos();    
                stepCount = 10;
            } else if (cmd < 17) { // look
                // obj type
                const objType = this.lookAtSector(cmd);
                this.updateCmdPos(objType);    
                stepCount++;
            } else {
                this.gotoCmdPos(cmd);
                stepCount++;
            }
        } while (stepCount < 10)

        return result; 
    }

    updateCmdPos(obj) {
        switch (obj) {
            case OBJ_TYPE_EMPTY:
                this.gotoCmdPos();
                break;
            case OBJ_TYPE_ENEMY_T:
                this.gotoCmdPos(2);
                break;
            case OBJ_TYPE_ENEMY_D:
                this.gotoCmdPos(3);
                break;
            case OBJ_TYPE_DROPLET_T:
                this.gotoCmdPos(4);
                break;
            case OBJ_TYPE_DROPLET_D:
                this.gotoCmdPos(5);
                break;
            default:
                this.gotoCmdPos(6);
        }
    }

    gotoCmdPos(value) {
        value = value || 1;
        this._cmdPos = (this._cmdPos + value) % CHIP_GENOM_SIZE;
    }

    lookAtSector(cmd) {
        cmd = (cmd - 1) % 8;

        // 0.414

        console.log('sector', MOVES[cmd]);

        return OBJ_TYPE_EMPTY;
    }
}