function printMap() {
    console.log('>>> MAP');
    console.log();
    for(var i=0; i<H; i++) {
        console.log(map[i].join(''));
    }
    console.log();
}

function printDistEnemy() {
    console.log('>>> DIST ENEMY')
    console.log();
    for(var i=0; i<H; i++) {
        var l1 = new Array(W + 1).join('  ');
        var l2 = '';
        for(var j=0; j<W; j++) {
            if(map[i][j] == '0') l2+= 'own ';
            else if(map[i][j] != '.') l2+= '[' + map[i][j] + '] ';
            else {
                var d = mapEnemyDist[i][j].toString().substring(0,3);
                l2+= d.length == 1 ? d + '.0 ' : d + ' ';
            }
        }
        console.log(l1);
        console.log(l2);
    }
    console.log();
}

function printDistOwn() {
    console.log('>>> DIST OWN')
    console.log();
    for(var i=0; i<H; i++) {
        var l1 = new Array(W + 1).join('  ');
        var l2 = '';
        for(var j=0; j<W; j++) {
            if(map[i][j] == '0') l2+= 'own ';
            else if(map[i][j] != '.') l2+= '[' + map[i][j] + '] ';
            else {
                var d = mapOwnDist[i][j].toString().substring(0,3);
                l2+= d.length == 1 ? d + '.0 ' : d + ' ';
            }
        }
        console.log(l1);
        console.log(l2);
    }
    console.log();
}


function printWeights() {
    console.log('>>> WEIGHTS');
    console.log();
    for(var i=0; i<H; i++) {
        var l1 = new Array(W + 1).join('  ');
        var l2 = '';
        for(var j=0; j<W; j++) {
            if(map[i][j] == '0') l2+= 'own  ';
            else if(map[i][j] != '.') l2+= '[ ' + map[i][j] + '] ';
            else {
                var dV = mapWeight[i][j].reduce(function (a, b) {
                        return a + b;
                    }) / mapWeight[i][j].length;
                var d = dV.toString().substring(0, 4);
                if (d.indexOf('.') == -1) d += '.';

                l2 += d + pad(4 - d.length, '0') + ' ';
            }

        }
        console.log(l1);
        console.log(l2);
    }
    console.log();
}

function pad(count, char) {
    return new Array(count + 1).join(char);
}
// -------------------

var W = 12;
var H = 9;
var map = [
    ['.','.','0','.','.','.','.','.','.','.','.','.'],
    ['.','.','0','1','1','.','.','.','.','.','.','.'],
    ['.','.','0','1','1','.','.','.','.','.','.','.'],
    ['.','.','0','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','0','0','0','.','.','.','.','.'],
    ['2','2','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.','.','.','.']
];


// -------------------

function dist(x1,y1,x2,y2){
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}
function isEnemyPoint(x, y) {
    return map[y][x] != '.' && map[y][x] != '0';
}
function isOwnPoint(x, y) {
    return map[y][x] == '0';
}
function isEmptyPoint(x, y) {
    return map[y][x] == '.';
}
function getMinDistToEnemy(x, y) {
    var result = 1/0;
    for(var i=0; i<H; i++) {
        for (var j = 0; j < W; j++) {
            if(isEnemyPoint(j, i)) {
                var d = dist(j, i, x, y);
                if (d < result) result = d;
            }
        }
    }
    return result;
}
function getMinDistToOwn(x, y) {
    var result = 1/0;
    for(var i=0; i<H; i++) {
        for (var j = 0; j < W; j++) {
            if(isOwnPoint(j, i)) {
                var d = dist(j, i, x, y);
                if (d < result) result = d;
            }
        }
    }
    return result;
}

function updatePlayersScore(){
    score=0;
    players[1].score = 0;
    players[2].score = 0;
    players[3].score = 0;
    for(var i=0; i<H; i++) {
        for (var j = 0; j < W; j++) {
            if(map[i][j] == '0') score++;
            if(map[i][j] != '.' && map[i][j] != '0') players[map[i][j]].score++;
        }
    }
}
function updateDistToEnemyMap(){
    mapEnemyDist = new Array(H);
    for(var i=0; i<H; i++) {
        mapEnemyDist[i] = new Array(W);
        for (var j = 0; j < W; j++) {
            if(!isEnemyPoint(j, i)) {
                mapEnemyDist[i][j] = getMinDistToEnemy(j, i);
            }
            else mapEnemyDist[i][j] = '0';
        }
    }
}
function updateDistToOwnMap() {
    mapOwnDist = new Array(H);
    for(var i=0; i<H; i++) {
        mapOwnDist[i] = new Array(W);
        for (var j = 0; j < W; j++) {
            if(isEmptyPoint(j, i)) {
                mapOwnDist[i][j] = getMinDistToOwn(j, i);
            }
            else mapOwnDist[i][j] = 0;
        }
    }
}
function updateWeights() {
    // Default weights
    mapWeight = new Array(H);
    for(var i=0; i<H; i++) {
        mapWeight[i] = new Array(W);
        for (var j = 0; j < W; j++) {
            mapWeight[i][j] = [];
            var kW = Math.pow(W, 1/Math.min(W-j,j+1));
            var kH = Math.pow(H, 1/Math.min(H-i,i+1));
            //mapWeight[i][j].push(kW);
            //mapWeight[i][j].push(kH);
        }
    }

    // Enemy weights
    var maxEnemyWeight = Math.max(W, H) / 2;// Max Weight
    for(var i=0; i<H; i++) {
        for (var j = 0; j < W; j++) {
            if(isEnemyPoint(j, i)) {
                updateWithWeight(j, i, maxEnemyWeight);
            }
        }
    }

    // Current position weights
    var maxCurPosWeight = Math.max(W, H);// Max Weight
    updateWithWeight(myX, myY, maxCurPosWeight);

    function updateWithWeight(x, y, weight) {
        for(var i=0; i<H; i++) {
            for (var j = 0; j < W; j++) {
                var kW = Math.pow(weight, 1/(Math.abs(x-j)+1));
                var kH = Math.pow(weight, 1/(Math.abs(y-i)+1));
                mapWeight[i][j].push(kW);
                mapWeight[i][j].push(kH);
            }
        }
    }

}

function getNextPoint() {
    var maxK = -1/0;
    var point = {x:0, y:0};
    for(var i=0; i<H; i++) {
        for (var j = 0; j < W; j++) {
            if(Math.abs(myX - j) < 10 && Math.abs(myY - i) < 10) {
                var midK = mapWeight[i][j].reduce(function (a, b) {
                        return a + b;
                    }) / mapWeight[i][j].length;
                if(isEmptyPoint(j, i) && midK > maxK) {
                    maxK = midK;
                    point.x = j;
                    point.y = i;
                }
            }
        }
    }
    if(maxK == -1/0) {
        maxK = -1/0;
        for(var i=0; i<H; i++) {
            for (var j = 0; j < W; j++) {
                var midK = mapWeight[i][j].reduce(function (a, b) {
                        return a + b;
                    }) / mapWeight[i][j].length;
                if(isEmptyPoint(j, i) && midK > maxK) {
                    maxK = midK;
                    point.x = j;
                    point.y = i;
                }
            }
        }
    }
    return point;
}




var score = 0;
var players = {
    1: {score: 0},
    2: {score: 0},
    3: {score: 0}
};
var mapEnemyDist = [];
var mapOwnDist = [];
var mapWeight = [];
var myX = 4, myY = 5;

updatePlayersScore();
updateDistToEnemyMap();
updateDistToOwnMap();
updateWeights();

printMap();
//printDistEnemy();
//printDistOwn();
printWeights();

console.log(getNextPoint());