const CHIP_GENOM_SIZE = 64;
const CHIP_COMMANDS_COUNT = 64;

class Chip {

    constructor(entity, genom) {
        this._entity = entity;
        this._genom = [];

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

    process(entities) {
        console.log(entities);

        


        return "WAIT";
    }
}