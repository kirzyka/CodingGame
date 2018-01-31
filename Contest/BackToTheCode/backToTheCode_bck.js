var opponentCount = parseInt(readline()); // Opponent count
var W = 35;
var H = 20;
var map = [];
var mapPrev = [];

var myPath = [];
var lastGameRound = -1;
var lastPoint = null;
var lastOwnPointCount = 0;
var ownPointCount = 0;
var emptyPointCount = 0;
var lastMyJump = -1;
var lastMyJumpSize = 0;
var enemyInfo = {
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
var superPoint = null;
var targetEnemy = 0;

var MAX_SPOT_WIDTH = opponentCount == 1 ? 14 : opponentCount == 2 ? 12 : 12;
var MAX_SPOT_HEIGHT = opponentCount == 1 ? 20 : opponentCount == 2 ? 15 : 10;
var BIG_SPOT = 50;
var MAX_BACK_IN_TIME = 25;
var MSG = '';

// game loop
while (true) {

    // RESET
    ownPointCount = 0;
    emptyPointCount = 0;
    resetEnemyInfo();

    // INPUT
    var gameRound = parseInt(readline());
    var inputs = readline().split(' ');
    var myX = parseInt(inputs[0]); // Your x position
    var myY = parseInt(inputs[1]); // Your y position
    var backInTimeLeft = parseInt(inputs[2]); // Remaining back in time

    myPath = updatePlayerPath({x: myX, y: myY}, myPath)

    for (var i = 0; i < opponentCount; i++) {
        var inputs = readline().split(' ');
        var enemyX = parseInt(inputs[0]); // X position of the opponent
        var enemyY = parseInt(inputs[1]); // Y position of the opponent
        var enemyBackInTimeLeft = parseInt(inputs[2]); // Remaining back in time of the opponent
        if(i==0) {
            enemyInfo.enemy1.x = enemyX;
            enemyInfo.enemy1.y = enemyY;
            enemyInfo.enemy1.backInTimeLeft = enemyBackInTimeLeft;
            enemyInfo.enemy1.path = updatePlayerPath({x: enemyX, y: enemyY}, enemyInfo.enemy1.path);
        }
        if(i==1) {
            enemyInfo.enemy2.x = enemyX;
            enemyInfo.enemy2.y = enemyY;
            enemyInfo.enemy2.backInTimeLeft = enemyBackInTimeLeft;
            enemyInfo.enemy2.path = updatePlayerPath({x: enemyX, y: enemyY}, enemyInfo.enemy2.path);
        }
        if(i==2) {
            enemyInfo.enemy3.x = enemyX;
            enemyInfo.enemy3.y = enemyY;
            enemyInfo.enemy3.backInTimeLeft = enemyBackInTimeLeft;
            enemyInfo.enemy3.path = updatePlayerPath({x: enemyX, y: enemyY}, enemyInfo.enemy3.path);
        }
    }
    map = [];
    for (var i = 0; i < H; i++) {
        var l = readline();
        emptyPointCount+= l.replace(/(?![\.])./g,'').length;
        ownPointCount+= l.replace(/(?![0])./g,'').length;
        enemyInfo.enemy1.pointCount += l.replace(/(?![1])./g,'').length;
        enemyInfo.enemy2.pointCount += l.replace(/(?![2])./g,'').length;
        enemyInfo.enemy3.pointCount += l.replace(/(?![3])./g,'').length;
        map.push(l.split(''));
    }

    // ANALYSIS
    if(lastMyJump > -1) lastMyJump++;
    if(ownPointCount - lastOwnPointCount > BIG_SPOT) {
        lastMyJump = 0;
        lastMyJumpSize = ownPointCount - lastOwnPointCount;
    }

    if(superPoint && superPoint.x == myX && superPoint.y == myY) superPoint = null;
    var spots = getSpots();
    var currentSpot = getSpotOnPoint(spots, myX, myY);
    calculateFirstPlacePlayer(ownPointCount);

    if(lastGameRound >= gameRound) {
        //superPoint = null;
        myPath.splice(0,gameRound-lastGameRound);
        enemyInfo.enemy1.path.splice(0,gameRound-lastGameRound);
        enemyInfo.enemy2.path.splice(0,gameRound-lastGameRound);
        enemyInfo.enemy3.path.splice(0,gameRound-lastGameRound);
        printErr('Back In Time Detected');
    }

    var backInTimeInfo = detectEnemyJump(currentSpot);

    // TURN
    if(superPoint && isEmptyPoint(superPoint.x, superPoint.y, map)) {
        print(superPoint.x, superPoint.y);
    } else if(backInTimeInfo && backInTimeLeft) {
        printErr('Wow, Dude! I have to stop you!');
        superPoint = backInTimeInfo.point;
        //printErr('SuperPoint', superPoint.x, superPoint.y);
        print('BACK', backInTimeInfo.step);
    } else {
        var spot = null;
        if(superPoint) {
            spot = currentSpot;
            superPoint = null;
            printErr('SUPER POINT')
        }

        if(!spot) spot = getNextSpot(spots);

        var point = getNextPoint(spot);
        if(lastPoint && point.x == lastPoint.x && point.y == lastPoint.y) point = {x:0, y:0}
        MSG = point.x + ' ' + point.y + ' ' + MSG;
        print(point.x, point.y, MSG.substr(0,Math.min(MSG.length, 30)));
    }


    mapPrev = copyArray(map);
    lastGameRound = gameRound;
    lastPoint = {x:myX, y:myY};
    lastOwnPointCount = ownPointCount;
    enemyInfo.enemy1.lastPointCount = enemyInfo.enemy1.pointCount;
    enemyInfo.enemy2.lastPointCount = enemyInfo.enemy2.pointCount;
    enemyInfo.enemy3.lastPointCount = enemyInfo.enemy3.pointCount;
}

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
    //var result =  (0,1+spot.complete) * spot.size/(getMinDistToSpot(spot)+1)
    //var result =  (spot.size + spot.complete) + (50/(getMinDistToSpot(spot)+1));
    //var result =  1/(getMinDistToSpot(spot)+1) + spot.complete;


    if(emptyPointCount < 100) {
        return 1/(getMinDistToSpot(spot)+1);
    } else {
        return (spot.size*spot.complete) + spot.size/(getMinDistToSpot(spot)+1)
        /*
         return spot.size +
         (spot.size * spot.complete) +
         (spot.size*(1/(getMinDistToSpot(spot)+1))) +
         (getMinDistToSpot(spot) < 5 ? spot.size : 0);
         */
    }
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
                var info =  getNearestPointInPath(point.x, point.y, myPath, MAX_BACK_IN_TIME);
                if(info.step > info.dist && (lastMyJump > info.step || lastMyJumpSize < diff+diff*0,3 || lastMyJump == -1)) {
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
    return {x:Math.floor(sumX/diffPoints.length), y:Math.floor(sumY/diffPoints.length)}
}

/*
 function getMSG(round) {
 var k = round % MSG.length;
 var l = 30;
 return MSG.substr(k, Math.min(l, MSG.length - k)) + ((k + l) > MSG.length ? MSG.substr(0, l - MSG.length + k) : '');
 }
 */