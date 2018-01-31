var Cell = function (x, y ,value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.type = (!isNaN(value) && value != 0) ? 'node' : 'empty'; // node, empty, vblock, hblock
    this.neighbors = [];    // Cell
    this.linked = [];       // Max 4 Cell
}

var Link = function (cell1, cell2, isLocked) {
    this.x1 = Math.min(cell1.x, cell2.x);
    this.y1 = Math.min(cell1.y, cell2.y);
    this.x2 = Math.max(cell1.x, cell2.x);
    this.y2 = Math.max(cell1.y, cell2.y);
    this.isLocked = isLocked || false;
    this.hash = 'from_' + this.x1 + '_' + this.y1 + '_to_' + this.x2 + '_' + this.y2;
}

var Grid = function (width, height) {
    this.width = width;
    this.height = height;
    this.links = [];
    this.MAP = [];
    for (var y = 0; y < this.height; y++) {
        this.MAP[y] = this.MAP[y] || [];
        for (var x = 0; x < this.width; x++) {
            this.addCell(x, y);
        }
    }
}

Grid.prototype.addCell = function (x, y, value) {
    return this.MAP[y][x] = new Cell(x, y,value);
}

Grid.prototype.getCell = function (x, y) {
    return this.MAP[y][x];
}

Grid.prototype.isLinkedCells = function (x, y, fx, fy, cache) {
    cache = cache || {};
    if(fx==x && fy==y) return true;
    var flag = false;
    var cell = this.getCell(x, y);
    for(var i=0; i<cell.linked.length; i++) {
        var linkedCell = cell.linked[i];
        var key = 'x1_' + Math.min(x, linkedCell.x) + '_y1_' + Math.min(y, linkedCell.y) + '_x2_' + Math.max(x, linkedCell.x) + '_y2_' + Math.max(y, linkedCell.y);
        if(!cache[key]) {
            cache[key] = 1;
            if(this.isLinkedCells(linkedCell.x, linkedCell.y, fx, fy, cache)) {
                flag = true;
                break;
            }
        }
    }
    console.log(cache)
    return flag;
}

Grid.prototype.isLinkedAllCells = function () {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var cell = this.getCell(x, y);
            if(cell.type == 'node') {
                for (var fy = 0; fy < this.height; fy++) {
                    for (var fx = 0; fx < this.width; fx++) {
                        var fcell = this.getCell(fx, fy);
                        if (x!=fx && y!= fy && fcell.type == 'node' && !this.isLinkedCells(x, y, fx, fy)) {
                            return false
                        }
                    }
                }
            }
        }
    }
    return true;
}
/*
var W = 8;
var H = 8;
var lines = [
    '3.4.6.2.',
    '.1......',
    '..2.5..2',
    '1.......',
    '..1.....',
    '.3..52.3',
    '.2.17..4',
    '.4..51.2'
];
*/
 /*
var W = 3;
var H = 3;
var lines = [
    '3.4',
    '1..',
    '..2'
];
*/

var W = 3;
var H = 3;
var lines = [
    '3.4',
    '...',
    '1.2'
];
var g = new Grid(W, H);

// Read Data
for (var i = 0; i < H; i++) {
    var line = lines[i];
    for(var j=0; j<line.length; j++) {
        g.addCell(j, i, line[j]);
    }
}

// MAP
console.log('----------------------- > ');
for (var y = 0; y < g.height; y++) {
    var row = '';
    for (var x = 0; x < g.width; x++) {
        var cell = g.getCell(x, y);
        if (cell.type == 'node') {
            row += cell.value + ' ';
        } else if (cell.type == 'vblock') {
            row += '| ';
        } else if (cell.type == 'hblock') {
            row += '- ';
        } else {
            row += '. ';
        }
    }
    console.log(row);
}
console.log('------------------- MAP < ');

g.getCell(0,0).linked.push(g.getCell(2,0))

g.getCell(2,0).linked.push(g.getCell(0,0))
g.getCell(2,0).linked.push(g.getCell(2,2))

g.getCell(2,2).linked.push(g.getCell(2,0))
g.getCell(2,2).linked.push(g.getCell(0,2))

//console.log(g.isLinkedAllCells())
console.log(g.isLinkedCells(2,0, 0,2))