var fs = require('fs');
var readline = require('readline');
var module1 = new require('./com/Module1')();

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var getLine = function (length, symbol) {
    symbol = symbol || '-';
    var line = '';
    for (var i = 0; i < length; i++) {
        line += symbol;
    }
    return line;
}

var drawLine = function (length) {
    console.log(getLine(length));
}

var getStringLines = function (source, maxLength) {
    var result = [];
    var lineNum = 1;
    var pattern = /\s/g;
    var exec = pattern.exec(s1);
    var lastIndex = 0;

    while (exec) {
        var index = exec['index'];
        if (index > (lineNum * maxLength)) {
            lineNum++;
            result.push(s1.substring(lastIndex, index).trim());
            lastIndex = index;
        }
        exec = pattern.exec(s1);
    }

    if (lastIndex != s1.length) {
        result.push(s1.substring(lastIndex, s1.length - 1).trim());
    }
    return result;
}

var printStringLines = function (source, width, textAlign) {

    //textAlign = textAlign || 'center';

    for (var i = 0; i < source.length; i++) {

        var spaceLeftWidth = 0;
        var spaceRightWidth = 0;

        if (textAlign == 'center') {
            spaceLeftWidth = Math.round((width - 2 - source[i].length) / 2);
            spaceRightWidth = width - 2 - source[i].length - spaceLeftWidth;
        } else {
            spaceLeftWidth = 4;
            spaceRightWidth = width - 2 - source[i].length - spaceLeftWidth;
        }


        var spaceLeft = getLine(spaceLeftWidth, ' ');
        var spaceRight = getLine(spaceRightWidth, ' ');

        console.log('|' + spaceLeft + source[i] + spaceRight + '|');
    }
}

var print = function (val) {
    console.log(val);
}
var printErr = function (val) {
    console.error(val);
}

// ======================================

var LOOP_LIMIT = 10000;

var Cell = function (x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.type = (!isNaN(value) && value != 0) ? 'node' : 'empty'; // node, empty, vblock, hblock
    this.neighbors = [];   	// Cell
    this.links = 0;      	// Link
}

Cell.prototype.getNeighborCount = function () {
    return this.neighbors.length;
}

Cell.prototype.getCapacity = function () {
    return this.value - this.links;
}


var Link = function (cell1, cell2, isStrong) {
    this.x1 = Math.min(cell1.x, cell2.x);
    this.y1 = Math.min(cell1.y, cell2.y);
    this.x2 = Math.max(cell1.x, cell2.x);
    this.y2 = Math.max(cell1.y, cell2.y);
    this.isStrong = isStrong || false;
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
    return this.MAP[y][x] = new Cell(x, y, value);
}

Grid.prototype.getCell = function (x, y) {
    return this.MAP[y][x];
}

Grid.prototype.updateNeighbors = function (x, y) {
    var cell = this.getCell(x, y);
    if (cell.type != 'node') return;
    cell.neighbors = [];
    var topNeighbor = this.getNeighbor(x, y, 'top');
    var rightNeighbor = this.getNeighbor(x, y, 'right');
    var downNeighbor = this.getNeighbor(x, y, 'down');
    var leftNeighbor = this.getNeighbor(x, y, 'left');

    if (topNeighbor) cell.neighbors.push(topNeighbor);
    if (rightNeighbor) cell.neighbors.push(rightNeighbor);
    if (downNeighbor) cell.neighbors.push(downNeighbor);
    if (leftNeighbor) cell.neighbors.push(leftNeighbor);
}

Grid.prototype.getNeighbor = function (x, y, direction) {
    switch (direction) {
        case 'top':
            for (var i = y - 1; i > -1; i--) {
                var cell = this.getCell(x, i);
                if (cell && cell.type == 'hblock') return null;
                if (cell && cell.type == 'node') return cell;
            }
            break;
        case 'down':
            for (var i = y + 1; i < this.height; i++) {
                var cell = this.getCell(x, i);
                if (cell && cell.type == 'hblock') return null;
                if (cell && cell.type == 'node') return cell;
            }
            break;
        case 'left':
            for (var i = x - 1; i > -1; i--) {
                var cell = this.getCell(i, y);
                if (cell && cell.type == 'vblock') return null;
                if (cell && cell.type == 'node') return cell;
            }
            break;
        case 'right':
            for (var i = x + 1; i < this.width; i++) {
                var cell = this.getCell(i, y);
                if (cell && cell.type == 'vblock') return null;
                if (cell && cell.type == 'node') return cell;
            }
            break;
    }
    return null;
}

Grid.prototype.addLink = function (cell1, cell2, isStrong) {
    if (cell1.links < cell1.value && cell2.links < cell2.value) {
        var link = new Link(cell1, cell2, isStrong);

        // Check if possible add
        var linkCount = 0;
        for (var i = 0; i < this.links.length; i++) {
            var _link = this.links[i];
            if (_link.hash == link.hash) linkCount++;
        }

        // Add
        if (linkCount < 2) {
            this.links.push(link);
            cell1.links++;
            cell2.links++;
            // Set block cells
            if (link.x1 == link.x2) {
                for (var i = link.y1 + 1; i < link.y2; i++) {
                    g.getCell(link.x1, i).type = 'vblock';
                }
            } else {
                for (var i = link.x1 + 1; i < link.x2; i++) {
                    g.getCell(i, link.y1).type = 'hblock';
                }
            }
            return true;
        }
    }
    return false;

}

Grid.prototype.removeLink = function (link) {
    var cell1 = g.getCell(link.x1, link.y1);
    var cell2 = g.getCell(link.x2, link.y2);

    // Check if possible remove
    var _linkIndex = -1;
    for (var i = 0; i < this.links.length; i++) {
        var _link = this.links[i];
        if (_link.hash == link.hash && !_link.isStrong) {
            _linkIndex = i;
            break;
        }
    }

    // Remove
    if (_linkIndex > -1) {
        this.links.splice(_linkIndex, 1);
        cell1.links--;
        cell2.links--;

        // Remove block cells
        if (link.x1 == link.x2) {
            for (var i = link.y1 + 1; i < link.y2; i++) {
                g.getCell(link.x1, i).type = 'empty';
            }
        } else {
            for (var i = link.x1 + 1; i < link.x2; i++) {
                g.getCell(i, link.y1).type = 'empty';
            }
        }
    }


}

Grid.prototype.getLink= function (cell1, cell2, isStrong) {
    var link = new Link(cell1, cell2);
    for (var i = 0; i < this.links.length; i++) {
        var _link = this.links[i];
        if (_link.hash == link.hash && _link.isStrong == isStrong) {
            return _link;
        }
    }
    return null;
}

Grid.prototype.getMaxLinkCount = function () {
    if (this.maxLinkCount) return this.maxLinkCount / 2;
    this.maxLinkCount = 0;
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var cell = g.getCell(x, y);
            if (cell.type == 'node') this.maxLinkCount += cell.value-0;
        }
    }
    return this.maxLinkCount / 2;
}

Grid.prototype.checkState = function () {
    return this.links.length == this.getMaxLinkCount();
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
 var g = new Grid(3, 3);
 g.addCell(0, 0, 1);
 g.addCell(2, 0, 2);
 g.addCell(2, 2, 1);
 */
/*
 var g = new Grid(2, 2);
 g.addCell(0, 0, 2);
 g.addCell(0, 1, 4);
 g.addCell(1, 1, 2);
 */
/*
 var g = new Grid(3, 3);
 g.addCell(0, 0, 1);
 g.addCell(2, 0, 3);
 g.addCell(0, 2, 1);
 g.addCell(1, 2, 2);
 g.addCell(2, 2, 3);
 */

/*
var W = 4;
var H = 4;
var lines = [
    '25.1',
    '47.4',
    '..1.',
    '3344'
];
*/
/*
var W = 3;
var H = 3;
var lines = [
    '1.1',
    '..2',
    '3.3'
];
*/
/*
var W = 4;
var H = 3;
var lines = [
    '14.3',
    '....',
    '.4.4'
];
*/


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

var g = new Grid(W, H);

// Read Data
for (var i = 0; i < H; i++) {
    var line = lines[i];
    for(var j=0; j<line.length; j++) {
        g.addCell(j, i, line[j]);
    }
}


// Calculate
var loopCount = 0;
var correctionMode = false;

// Once time
for (var y = 0; y < g.height; y++) {
    for (var x = 0; x < g.width; x++) {
        var cell = g.getCell(x, y);
        g.updateNeighbors(x, y);


        // Overflow
        if ((cell.value > 2 && cell.getNeighborCount() == 2) ||
            (cell.value > 4 && cell.getNeighborCount() == 3) ||
            (cell.value > 6 && cell.getNeighborCount() == 4)) {
            for (var i = 0; i < cell.getNeighborCount(); i++) {
                var neighbor = cell.neighbors[i];
                if (neighbor.getCapacity() > 0 && cell.getCapacity() > 0) {
                    g.addLink(cell, neighbor, true);
                }
            }
        }


        // Capacity == Neighbour Count * 2
        if (cell.value == cell.getNeighborCount()*2) {

            for (var i = 0; i < cell.getNeighborCount(); i++) {
                var neighbor = cell.neighbors[i];
                if (neighbor.getCapacity() > 0 && cell.getCapacity() > 0) {
                    g.addLink(cell, neighbor, true);
                    g.addLink(cell, neighbor, true);
                }
            }
        }

        // Capacity == Neighbour Count == 1
        if (cell.value == 1 && cell.getNeighborCount() == 1) {
            var neighbor = cell.neighbors[0];
            if (neighbor.getCapacity() > 0 && cell.getCapacity() > 0) {
                g.addLink(cell, neighbor, true);
            }
        }

        // Neighour Count == 1
        if (cell.value > 0 && cell.getNeighborCount() == 1) {
            var neighbor = cell.neighbors[0];
            if (neighbor.getCapacity() > 0 && cell.getCapacity() == 1) {
                g.addLink(cell, neighbor, true);
            }
            if (neighbor.getCapacity() > 0 && cell.getCapacity() == 2) {
                g.addLink(cell, neighbor, true);
                g.addLink(cell, neighbor, true);
            }
        }
    }
}


while (!g.checkState() && loopCount < LOOP_LIMIT) {

    if (correctionMode && loopCount % 4 == 0) {
        for (var y = 0; y < g.height; y++) {
            for (var x = 0; x < g.width; x++) {
                var cell = g.getCell(x, y);
                if (cell.type != 'node' || cell.getCapacity() == 0) continue;
                g.updateNeighbors(x, y);

                var noVariant = true;
                for (var i = 0; i < cell.getNeighborCount(); i++) {
                    var neighbor = cell.neighbors[i];
                    var _link = g.getLink(cell, neighbor, false);
                    if (neighbor.getCapacity() > 0 && _link) noVariant = false;
                }

                if (noVariant && cell.getNeighborCount() > 0) {

                   // console.log(cell, noVariant);

                    var nIndex = getRandom(0, cell.getNeighborCount() - 1);
                    var n1 = cell.neighbors[nIndex];
                    g.updateNeighbors(n1.x, n1.y);
                    nIndex = getRandom(0, n1.getNeighborCount() - 1);
                    var n2 = n1.neighbors[nIndex];

                    var link = g.getLink(n1, n2, false);
                    if (link && n2.x != cell.x && n2.y != cell.y) {
                        g.removeLink(link);
                        //console.log('Remove link');
                        //console.log(link);
                        //break;
                    }
                }

            }
        }
    }

    for (var y = 0; y < g.height; y++) {
        for (var x = 0; x < g.width; x++) {
            var cell = g.getCell(x, y);
            g.updateNeighbors(x, y);

            var nIndex = getRandom(0, cell.getNeighborCount() - 1);
            var neighbor = cell.neighbors[nIndex];
            if (neighbor && neighbor.getCapacity() > 0 && cell.getCapacity() > 0 && neighbor.value > 1) {
                g.addLink(cell, neighbor);
            }
            /*
            for (var i = 0; i < cell.getNeighborCount(); i++) {
                var neighbor = cell.neighbors[i];
                if (neighbor.getCapacity() > 0 && cell.getCapacity() > 0 && neighbor.value > 1) {
                    g.addLink(cell, neighbor);
                }
            }
            */
        }
    }
    correctionMode = true;
    loopCount++;
}


// Debug
if(loopCount == LOOP_LIMIT) {
    printErr('Loop Limit!')
} else {
    printErr(loopCount)
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
// 
// STATE
console.log('----------------------- > ');
for (var y = 0; y < g.height; y++) {
    var row = '';
    for (var x = 0; x < g.width; x++) {
        var cell = g.getCell(x, y);
        if (cell.type == 'node') {
            row += cell.value - cell.links + ' ';
        } else {
            row += '0 ';
        }
    }
    console.log(row);
}
console.log('----------------- STATE < ');
// 


// Result
 /*
var _LINKS = {};
for(var i=0; i< g.links.length; i++) {
    if(!_LINKS[g.links[i].hash]) {
        _LINKS[g.links[i].hash] = 1;
    } else {
        _LINKS[g.links[i].hash]++;
    }
}

for (var prop in _LINKS) {
    var count = _LINKS[prop];
    var r = /from_(\d*)_(\d*)_to_(\d*)_(\d*)/g;
    r = r.exec(prop);
    console.log(r[1], r[2], r[3], r[4], count);
}

  */


