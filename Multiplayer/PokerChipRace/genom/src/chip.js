const CHIP_GENOM_SIZE = 64;
const CHIP_COMMANDS_COUNT = 64;

class Chip extends Entity {

    constructor(genom, x, y, radius, playerId) {
        super(x, y, radius, playerId);
        this._genom = [];
    }

    get genom() {
        return this._genom;
    }

    get cmdPos() {
        return this._cmdPos;
    }

    set cmdPos(value) {
        this._cmdPos = value;
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
}