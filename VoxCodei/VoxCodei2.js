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


/*// Test 01
 var width = 4;
 var height = 3;
 var r = 15;
 var b = 1;
 var map = [
 '....'.split(''),
 '.@..'.split(''),
 '....'.split('')
 ];*/

// Test 03
var width = 12;
var height = 9;
var r = 15;
var b = 9;
var map = [
    '@...@.......'.split(''),
    '.......@...@'.split(''),
    '............'.split(''),
    '...@.....@..'.split(''),
    '............'.split(''),
    '.@..........'.split(''),
    '......@.....'.split(''),
    '.........@..'.split(''),
    '............'.split('')
];

/*// Test 04
 var width = 8;
 var height = 6;
 var map = [
 '.@.....@'.split(''),
 '........'.split(''),
 '........'.split(''),
 '........'.split(''),
 '........'.split(''),
 '.@.....@'.split('')

 ];*/

/*// Test 07
var width = 12;
var height = 9;
var r = 15;
var b = 4;
var map = [
    '............'.split(''),
    '..##....##..'.split(''),
    '.#@@#..#@@#.'.split(''),
    '............'.split(''),
    '.#@@#..#@@#.'.split(''),
    '..##....##..'.split(''),
    '............'.split(''),
    '............'.split(''),
    '............'.split('')
];*/

/*// Test 08
var width = 8;
var height = 6;
var r = 10;
var b = 3;
var map = [
    '........'.split(''),
    '......@.'.split(''),
    '@@@.@@@@'.split(''),
    '......@.'.split(''),
    '........'.split(''),
    '........'.split('')
];*/

/*// Test 09
 var width = 8;
 var height = 6;
 var r = 10;
 var b = 2;
 var map = [
 '........'.split(''),
 '......@.'.split(''),
 '@@@.@@@@'.split(''),
 '......@.'.split(''),
 '........'.split(''),
 '........'.split('')
 ];*/

//------------------

var points = [
    {dx: -1, index: 0, block: [1, 2]},
    {dx: -2, index: 1, block: [2]},
    {dx: -3, index: 2, block: []},
    {dx: 1, index: 0, block: [4, 5]},
    {dx: 2, index: 1, block: [5]},
    {dx: 3, index: 2, block: []},
    {dy: -1, index: 0, block: [7, 8]},
    {dy: -2, index: 1, block: [8]},
    {dy: -3, index: 2, block: []},
    {dy: 1, index: 0, block: [10, 11]},
    {dy: 2, index: 1, block: [11]},
    {dy: 3, index: 2, block: []}
];
var actions = [];
var k = 0;

//console.log(getPlantPoints(map));
console.log(map);
initialize(r, b);
console.log(actions);
console.log(k)

function initialize(rounds, bombs) {
    getActionPath(rounds, bombs, map, []);
}

function getActionPath(rounds, bombs, map, path) {
    k++;

    map = processMap(map);

    if(isMapClear(map)) {
        return actions = path;
    } else if(rounds > 0) {
        rounds--;
        if(path.length > 0 && ((path.length > 2 && (path[path.length-2] != 'WAIT' || path[path.length-1] != 'WAIT')) || path.length < 3)) {
            var waitPath = path.concat(['WAIT']);
            getActionPath(rounds, bombs, map, waitPath);
        }

        if(bombs > 0 && rounds > 2) {
            bombs--;
            var points = getPlantPoints(map);
            var pointsDamage = {};

            points.forEach(function(item) {
                pointsDamage[item.damage] = pointsDamage[item.damage] ? pointsDamage[item.damage]++ : 1 ;
            })
            var demLen = Object.keys(pointsDamage).length
            points = points.filter(function(item) {
                return (demLen > 0 && item.damage > 1) || demLen == 1;
            })
            var map1 = processMap(map)
            var map2 = processMap(map1)
            if(!isMapClear(map2)) {
                //console.log('PLANT', points.length);
                for (var i = 0; i < points.length; i++) {
                    //if ((points.length > 1 && points[i].damage > 1) || points.length == 1) {
                    getActionPath(rounds, bombs, points[i].map, path.concat([points[i].x + ' ' + points[i].y]));
                    //}
                }
            }
        }
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
function getPlantPoints(map) {
    var result = [];
    /* PlantPoint
     {
     x: 0,
     y: 0,
     map: [],
     damage: 0
     }
     */
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (isFreePoint(j, i, map)) {
                var d = getDamage(j, i, map);
                if(d.damage > 0) {
                    var plantPoint = {
                        x: j,
                        y: i,
                        map: d.map,
                        damage: d.damage
                    }
                    result.push(plantPoint);
                }
            }
        }
    }
    return result;
}
function processMap(map) {
    var _map = copyArray(map);
    for(var i=0; i<height; i++) {
        var l = _map[i].join('');
        l = l.replace(/1/g, '.').replace(/2/g, '1').replace(/3/g, '2');
        l = l.replace(/A/g, '.').replace(/B/g, 'A').replace(/C/g, 'B');
        _map[i] = l.split('');
    }
    return _map;
}

function isMapClear(map) {
    var result = true;
    for(var i=0; i<height; i++) {
        var l =map[i].join('');
        if(l.indexOf('@') > -1) result = false;
    }

    return result;
}






