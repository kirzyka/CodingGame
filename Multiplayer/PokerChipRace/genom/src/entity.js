class Entity {
    constructor(x, y, radius, playerId, id, vx, vy) {
        this._id = id || getID();
        this._playerId = playerId || -1;
        this._radius = radius;
        this._x = x;
        this._y = y;
        this._vx = vx || this._playerId === -1 ? getRandomInt(-10, 10) : 0;
        this._vy = vy || this._playerId === -1 ? getRandomInt(-10, 10) : 0;
    }

    get id() {
        return this._id;
    }

    get playerId() {
        return this._playerId;
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

    swallow(entity) {
        this._radius = Math.sqrt(Math.pow(this._radius, 2) + Math.pow(entity.radius, 2));
    }
}