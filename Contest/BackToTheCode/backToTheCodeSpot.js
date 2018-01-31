var A = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
function printMap() {

    for(var i=0; i<spots.length; i++) {
        var spot = spots[i];
        for(var j=0; j<spot.contour.length; j++) {
            var point = spot.contour[j];
            if(isEmptyPoint(point.x, point.y, map)) map[point.y][point.x] = A[spot.id-1];
        }
    }

    for(var i=0; i<H; i++) {
        var l = map[i].join('');
        if(i==myY) l = l.replaceAt(myX, 'X')
        console.log(l);
    }
}

// ---------------------

var W = 35;
var H = 20;
var myX = 32;
var myY = 9;
var enemyInfo = {
    firstPlacePlayer: 0,
    enemy1: {
        x: 0,
        y: 0,
        lastPointCount: 0,
        pointCount: 0,
        backInTimeLeft: 0,
        path: []
    },
    enemy2: {
        x: 0,
        y: 0,
        lastPointCount: 0,
        pointCount: 0,
        backInTimeLeft: 0,
        path: []
    },
    enemy3: {
        x: 0,
        y: 0,
        lastPointCount: 0,
        pointCount: 0,
        backInTimeLeft: 0,
        path: []
    }
};
var map = [
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','1','1','1','1','1','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','1','.','.','.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','0','.','.'],
    ['.','.','1','.','.','.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','1','.','.','.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','1','1','1','1','1','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.']
];
// -------------------
var MAX_SPOT_WIDTH = W;
var MAX_SPOT_HEIGHT = H;
var BIG_SPOT = 100;
var MAX_BACK_IN_TIME = 25;


function copyArray(a) {
    var result = [];
    for(var i=0; i<a.length; i++) {
        result[i] = a[i].slice();
    }
    return result
}
function isEnemyPoint(x, y, map) {
    return map[y][x] != '.' && map[y][x] != '0';
}
function isOwnPoint(x, y, map) {
    return map[y][x] == '0';
}
function isEmptyPoint(x, y, map) {
    return map[y][x] == '.';
}
function getSpots() {
    var tmpMap = copyArray(map);
    var result = [];
    var spotId = 1;

    for(var i=0; i<H; i++) {
        for(var j=0; j<W; j++) {
            if(tmpMap[i][j] == '.') {
                var spot = {
                    id: spotId,
                    initX: j,
                    initY: i,
                    minX: 1/0,
                    maxX: -1/0,
                    minY: 1/0,
                    maxY: -1/0,
                    minEnemyX: 1/0,
                    maxEnemyX: -1/0,
                    minEnemyY: 1/0,
                    maxEnemyY: -1/0,
                    size: 0,
                    path: [],
                    contour: [],
                    complete: 0.0
                };
                findSpotCells(spot, j, i,tmpMap);
                createContour(spot);
                calculateCompleteStatus(spot);
                result.push(spot);
                spotId++;
            }
        }
    }

    return result;
};
function findSpotCells(spot, x, y, tmpMap) {
    // Check point if can extend
    if (x > spot.maxX && x < W && spot.maxX - spot.minX < MAX_SPOT_WIDTH && (x < spot.maxEnemyX || spot.maxEnemyX == -1 / 0)) spot.maxX = x;
    if (y > spot.maxY && y < H && spot.maxY - spot.minY < MAX_SPOT_HEIGHT && (y < spot.maxEnemyY || spot.maxEnemyY == -1 / 0)) spot.maxY = y;
    if (x < spot.minX && x > -1 && spot.maxX - spot.minX < MAX_SPOT_WIDTH && (x > spot.minEnemyX || spot.minEnemyX == 1 / 0)) spot.minX = x;
    if (y < spot.minY && y > -1 && spot.maxY - spot.minY < MAX_SPOT_HEIGHT && (y > spot.minEnemyY || spot.minEnemyY == 1 / 0)) spot.minY = y;

    // if success point
    if(x >= spot.minX && x <= spot.maxX && y >= spot.minY && y <= spot.maxY && !isEnemyPoint(x, y, map) && tmpMap[y][x] != 'X') {
        spot.path.push({x: x, y: y});
        spot.size++;
        tmpMap[y][x] = 'X';
        if(isOwnPoint(x, y, map)) return spot;

        // get enemy borders
        if(x > 0 && (x-1 > spot.minEnemyX || spot.minEnemyX == 1/0) && isEnemyPoint(x-1, y, map)) spot.minEnemyX = x-1;
        if(y > 0 && (y-1 > spot.minEnemyY || spot.minEnemyY == 1/0) && isEnemyPoint(x, y-1, map)) spot.minEnemyY = y-1;
        if(x < W-1 && (x+1 < spot.maxEnemyX || spot.maxEnemyX == -1/0) && isEnemyPoint(x+1, y, map)) spot.maxEnemyX = x+1;
        if(y < H-1 && (y+1 < spot.maxEnemyY || spot.maxEnemyY == -1/0) && isEnemyPoint(x, y+1, map)) spot.maxEnemyY = y+1;

        // get new points
        if(x > 0 && y > 0) findSpotCells(spot, x-1, y-1, tmpMap);
        if(y > 0) findSpotCells(spot, x, y-1, tmpMap);
        if(x < W-1 && y > 0) findSpotCells(spot, x+1, y-1, tmpMap);
        if(x < W-1) findSpotCells(spot, x+1, y, tmpMap);
        if(x < W-1 && y < H-1) findSpotCells(spot, x+1, y+1, tmpMap);
        if(y < H-1) findSpotCells(spot, x, y+1, tmpMap);
        if(x > 0 && y < H-1) findSpotCells(spot, x-1, y+1, tmpMap);
        if(x > 0 ) findSpotCells(spot, x-1, y, tmpMap);
    }

    return spot;
}
function createContour(spot) {
    var result = [];
    for(var i=0; i<spot.path.length; i++) {
        var point = spot.path[i];
        var c = 0;
        var t = []
        if(point.x>0 && !isEnemyPoint(point.x-1, point.y, map) && isPointExist(point.x-1, point.y, spot.path)) {c++;t.push('1')};
        if(point.y>0 && !isEnemyPoint(point.x, point.y-1, map) && isPointExist(point.x, point.y-1, spot.path)) {c++;t.push('2')};
        if(point.x<W-1 && !isEnemyPoint(point.x+1, point.y, map) && isPointExist(point.x+1, point.y, spot.path)) {c++;t.push('3')};
        if(point.y<H-1 && !isEnemyPoint(point.x, point.y+1, map) && isPointExist(point.x, point.y+1, spot.path)) {c++;t.push('4')};

        if(point.x>0 && point.y>0 && !isEnemyPoint(point.x-1, point.y-1, map) && isPointExist(point.x-1, point.y-1, spot.path)) {c++;t.push('5')};
        if(point.x<W-1 && point.y>0 && !isEnemyPoint(point.x+1, point.y-1, map) && isPointExist(point.x+1, point.y-1, spot.path)) {c++;t.push('6')};
        if(point.x<W-1 && point.y<H-1 && !isEnemyPoint(point.x-1, point.y+1, map) && isPointExist(point.x-1, point.y+1, spot.path)) {c++;t.push('7')};
        if(point.x>0 && point.y<H-1 && !isEnemyPoint(point.x+1, point.y+1, map) && isPointExist(point.x+1, point.y+1, spot.path)) {c++;t.push('8')};

        if(c != 8) result.push(point);
    }
    spot.contour = result;

    function isPointExist(x, y, path) {
        for(var i=0; i<path.length; i++) {
            var point = path[i];
            if(point.x == x && point.y == y) return true;
        }
        return false;
    }
}
function calculateCompleteStatus(spot) {
    var c = 0;
    for(var j=0; j<spot.contour.length; j++) {
        var point = spot.contour[j];
        if(isOwnPoint(point.x, point.y, map)) c++;
    }
    spot.complete = c/spot.contour.length;
}
function getNextSpot(spots) {
    var result;
    var maxRate = -1/0;
    for(var i=0; i<spots.length; i++) {
        var spot = spots[i];
        var rate = getSpotRate(spot);
        if(rate > maxRate) {
            maxRate = rate;
            result = spot;
        }
    }
    return result;
}
function getSpotRate(spot) {
    var result =  (0,1+spot.complete) * spot.size/(getMinDistToSpot(spot)+1)
    //var result =  spot.size + (spot.size + spot.complete) + (spot.size*2/(getMinDistToSpot(spot)+1));
    //var result =  (spot.size + spot.complete) + (50/(getMinDistToSpot(spot)+1));
    //var result =  1/(getMinDistToSpot(spot)+1) + spot.complete;
    return result;
}
function getNextPoint(spot) {
    var result = {x:0, y:0};
    if(!spot) return result;
    var minD = 1/0;
    for(var i=0; i<spot.contour.length; i++) {
        var point = spot.contour[i];
        if(isEmptyPoint(point.x, point.y, map)) {
            var d = dist(myX, myY, point.x, point.y);
            if (d < minD) {
                minD = d;
                result = point;
            }
        }
    }
    return result;
}
function getSpotOnPoint(spots, x, y) {
    for(var i=0; i<spots.length; i++) {
        var spot = spots[i];
        for(var j=0; j<spot.path.length; j++) {
            var point = spot.path[j];
            if(x == point.x && y == point.y) return spot;
        }
    }
    return null;
}
function getMinDistToSpot(spot) {
    var minD = 1/0;
    for(var i=0; i<spot.contour.length; i++) {
        var point = spot.contour[i];
        if(isEmptyPoint(point.x, point.y, map)) {
            var d = dist(myX, myY, point.x, point.y);
            if (d < minD) minD = d;
        }
    }
    return minD;
}
function dist(x1,y1,x2,y2){
    return Math.abs(x1-x2) + Math.abs(y1-y2);
}
function updatePlayerPath(point, path) {
    path.unshift(point);
    return path;
}
function resetEnemyInfo() {
    enemyInfo.enemy1.pointCount = 0;
    enemyInfo.enemy2.pointCount = 0;
    enemyInfo.enemy3.pointCount = 0;
}
function calculateFirstPlacePlayer(myScore) {
    if (enemyInfo.enemy1.pointCount > enemyInfo.enemy2.pointCount && enemyInfo.enemy1.pointCount > enemyInfo.enemy3.pointCount && enemyInfo.enemy1.pointCount > myScore) enemyInfo.firstPlacePlayer = 1;
    else if (enemyInfo.enemy2.pointCount > enemyInfo.enemy1.pointCount && enemyInfo.enemy2.pointCount > enemyInfo.enemy3.pointCount && enemyInfo.enemy2.pointCount > myScore) enemyInfo.firstPlacePlayer = 2;
    else if (enemyInfo.enemy3.pointCount > enemyInfo.enemy1.pointCount && enemyInfo.enemy3.pointCount > enemyInfo.enemy2.pointCount && enemyInfo.enemy3.pointCount > myScore) enemyInfo.firstPlacePlayer = 3;
    else enemyInfo.firstPlacePlayer = 0;
}
function getNearestPointInPath(x, y, path, stepLimit) {
    var result;
    var minD = 1/0;
    for(var i=0; i<Math.min(path.length, stepLimit); i++) {
        var point = path[i];
        var step = i;
        var d = dist(x, y, point.x, point.y);
        if(d < minD) {
            minD = d;
            result = {point: {x:x, y:y}, step: step, dist: d};
        }
    }
    return result;
}
function detectEnemyJump(currentSpot) {
    for(var i=1; i<4; i++) {
        var diff = enemyInfo['enemy' + i].pointCount - enemyInfo['enemy' + i].lastPointCount;
        if (diff > BIG_SPOT && enemyInfo.firstPlacePlayer == i) {
            if ((currentSpot && currentSpot.size < diff+10 && currentSpot.complete < 0,7) ||
                !currentSpot) {
                var point = tryGetEnemySpotCenter(i);
                //enemyInfo['enemy' + i].x, enemyInfo['enemy' + i].y
                var info =  getNearestPointInPath(point.x, point.y, myPath, MAX_BACK_IN_TIME);
                if(info.step > info.dist && (lastMyJump > info.step || lastMyJump == -1)) {
                    targetEnemy = i;
                    return info;
                }
            }
        }
    }
}
function tryGetEnemySpotCenter(enemyNum) {
    var diffPoints = [];
    var sumX = 0;
    var sumY = 0;
    for(var i=0; i<H; i++) {
        for(var j=0; j<W; j++) {
            if(map[i][j] == enemyNum && isEmptyPoint(j, i, mapPrev)) diffPoints.push({x:j, y:i})
        }
    }
    for(var i=0; i<diffPoints.length; i++) {
        var p = diffPoints[i];
        sumX+= p.x;
        sumY+= p.y;
    }
    return {x:sumX/diffPoints.length, y:sumY/diffPoints.length}
}
/*
 function getMSG(round) {
 var k = round % MSG.length;
 var l = 30;
 return MSG.substr(k, Math.min(l, MSG.length - k)) + ((k + l) > MSG.length ? MSG.substr(0, l - MSG.length + k) : '');
 }
 */
var spots = getSpots();
var spot = getNextSpot(spots);
var point = getNextPoint(spot);

console.log(point)
/*console.log('center', tryGetEnemySpotCenter(8, 6, 1, 23));*/
printMap();

/*for(var i=0; i<H; i++) {
    console.log(map[i].length)
}*/

