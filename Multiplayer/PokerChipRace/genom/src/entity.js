class Entity {
    constructor(x, y, radius, playerId) {
        this._id = getID();
        this._playerId = playerId || -1;
        this._radius = radius;
        this._x = x;
        this._y = y;
        this._vx = this._playerId === -1 ? getRandomInt(-10, 10) : 0;
        this._vy = this._playerId === -1 ? getRandomInt(-10, 10) : 0;
    }

    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }

    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }

    get vx() {
        return this._vx;
    }
    set vx(value) {
        this._vx = value;
    }

    get vy() {
        return this._vy;
    }
    set vy(value) {
        this._vy = value;
    }
}