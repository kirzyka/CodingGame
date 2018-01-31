function print(val) {
    console.log(val)
}

//------------------

/*
 var width = 4;
 var height = 3;
 var map = [
 '....'.split(''),
 '@.@@'.split(''),
 '....'.split('')
 ];
 */

var width = 8;
var height = 6;
var map = [
    '.@.....@'.split(''),
    '........'.split(''),
    '........'.split(''),
    '........'.split(''),
    '........'.split(''),
    '.@.....@'.split('')

];
//------------------

var points = [
    {dx: -1, index: 0, block: [1, 2]},
    {dx: -2, index: 1, block: [2]},
    {dx: -3, index: 2, block: []},
    {dx: 1, index: 0, block: [4, 5]},
    {dx: 2, index: 1, block: [4]},
    {dx: 3, index: 2, block: []},
    {dy: -1, index: 0, block: [7, 8]},
    {dy: -2, index: 1, block: [8]},
    {dy: -3, index: 2, block: []},
    {dy: 1, index: 0, block: [10, 11]},
    {dy: 2, index: 1, block: [11]},
    {dy: 3, index: 2, block: []}
];
var actions = [];

console.log(map);
initialize(5, 2);
console.log(actions);

function initialize(rounds, bombs) {


  var _map = copyArray(map);
    while(rounds) {
        var position = getOptimalPosition(_map);
        if(position && bombs) {
            actions.push(position.x + ' ' + position.y);
            _map = position.map;
            bombs--;
        } else {
            actions.push('WAIT')
        }
        _map = processMap(_map);
        rounds--;
    }
}

function copyArray(a) {
    var result = [];
    for(var i=0; i<a.length; i++) {
        result[i] = a[i].slice();
    }
    return result
}
function isFreePoint(x, y, map) {
    return map[y][x] == '.';
}
function isTargetPoint(x, y, map) {
    return map[y][x] == '@';
}
function isBlockPoint(x, y, map) {
    return map[y][x] == '#';
}
function isBombPoint(x, y, map) {
    return new RegExp('[123]').test(map[y][x]);
}
function isOnHoldPoint(x, y, map) {
    return new RegExp('[ABC]').test(map[y][x]);
}
function getDamage(x, y, map) {
    var result = {
        damage:0,
        map: copyArray(map)
    };

    var blockedIndexes = [];
    result.map[y][x] = '3';
    points.forEach(function (item, index) {

        var point = null;
        if (item.dx && -1 < x + item.dx && x + item.dx < width) point = {x: x + item.dx, y: y};
        if (item.dy && -1 < y + item.dy && y + item.dy < height) point = {x: x, y: y + item.dy};

        if (point && blockedIndexes.indexOf(index) == -1) {
            if(isBlockPoint(point.x, point.y, map)) {
                blockedIndexes = blockedIndexes.concat(item.block);
                return;
            }
            if(isTargetPoint(point.x, point.y, map)) {
                result.map[point.y][point.x] = 'C';
                result.damage++;
            }
        }
    });
    return result;
}
function getOptimalPosition(map) {
    var result = {
        x: 0,
        y: 0,
        map: [],
        damage: 0
    };
    var max = -1 / 0;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (isFreePoint(j, i, map)) {
                var d = getDamage(j, i, map);
                if (d.damage > max) {
                    max = d.damage;
                    result.damage = d.damage;
                    result.map = d.map;
                    result.x = j;
                    result.y = i;
                }
            }
        }
    }
    return result.damage ? result : null;
}
function processMap(map) {
    var _map = copyArray(map);
    for(var i=0; i<height; i++) {
        var l = _map[i].join('');
        l = l.replace('1', '.').replace('2', '1').replace('3', '2');
        l = l.replace('A', '.').replace('B', 'A').replace('C', 'B');
        _map[i] = l.split('');
    }
    return _map;
}







