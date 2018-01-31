function print(val) {
    console.log(val)
}
function printPath(startFloor, startPos, path) {
    var map = [];
    for(var i=0; i<nbFloors; i++) {
        map[i] = new Array(width+1).join('.').split('');
    }
    map[startFloor][startPos] = 'S';
    for(var i=0; i<path.length; i++) {
        var point = path[i];
        if(point.type == Point.prototype.TYPE_BLOCK) map[point.floor][point.pos] = 'B';
        if(point.type == Point.prototype.TYPE_ELEVATOR) map[point.floor][point.pos] = 'E';
        if(point.type == Point.prototype.TYPE_FINISH) map[point.floor][point.pos] = 'F';
    }
    for(var i=nbFloors-1; i>-1; i--) {
        console.log(map[i].join(''))
    }
}


//

Point = function(floor, pos, type, action) {
    this.floor = floor;
    this.pos = pos;
    this.type = type;
    this.action = action || 'WAIT';
}

Point.prototype.TYPE_FINISH = 'FINISH';
Point.prototype.TYPE_BLOCK = 'BLOCK';
Point.prototype.TYPE_ELEVATOR = 'ELEVATOR';


/*
// Simple
var nbFloors = 2;
var nbRounds = 80;
var exitFloor = 1;
var width = 13;
var startPos = 2;
var nbAdditionalElevators = 1;
var points = [
    new Point(1, 11, Point.prototype.TYPE_FINISH)
];
*/
// Simple
var nbFloors = 6;
var nbRounds = 80;
var exitFloor = 5;
var width = 13;
var startPos = 1;
var nbAdditionalElevators = 5;
var points = [
    new Point(5, 10, Point.prototype.TYPE_FINISH)
];


/*// Simple
var nbFloors = 5;
var nbRounds = 80;
var exitFloor = 4;
var width = 6;
var startPos = 1;
var nbAdditionalElevators = 1;
var points = [
    new Point(0, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 2, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(3, 4, Point.prototype.TYPE_FINISH)
];*/

/*var nbFloors = 10;
var exitFloor = 9;
var width = 19;
var points = [
    new Point(0, 3, Point.prototype.TYPE_ELEVATOR),
    new Point(0, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 3, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(3, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(3, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(4, 3, Point.prototype.TYPE_ELEVATOR),
    new Point(4, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(5, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(5, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(6, 3, Point.prototype.TYPE_ELEVATOR),
    new Point(6, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(7, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(7, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(8, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(9, 9, Point.prototype.TYPE_FINISH)
];*/
/*
var nbFloors = 13;
var nbRounds = 67;
var exitFloor = 11;
var width = 36;
var startPos = 6;
var nbAdditionalElevators = 4;
var points = [
    new Point(0, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 24, Point.prototype.TYPE_ELEVATOR),
    new Point(1, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 3, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 23, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 24, Point.prototype.TYPE_ELEVATOR),
    new Point(2, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(3, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(4, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(4, 23, Point.prototype.TYPE_ELEVATOR),
    new Point(4, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(5, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(5, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(6, 13, Point.prototype.TYPE_ELEVATOR),
    new Point(6, 22, Point.prototype.TYPE_ELEVATOR),
    new Point(6, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(7, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(7, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(8, 1, Point.prototype.TYPE_ELEVATOR),
    new Point(8, 9, Point.prototype.TYPE_ELEVATOR),
    new Point(8, 23, Point.prototype.TYPE_ELEVATOR),
    new Point(8, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(9, 2, Point.prototype.TYPE_ELEVATOR),
    new Point(9, 17, Point.prototype.TYPE_ELEVATOR),
    new Point(9, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(10, 3, Point.prototype.TYPE_ELEVATOR),
    new Point(10, 23, Point.prototype.TYPE_ELEVATOR),
    new Point(10, 34, Point.prototype.TYPE_ELEVATOR),
    new Point(11, 4, Point.prototype.TYPE_ELEVATOR),
    new Point(11, 11, Point.prototype.TYPE_ELEVATOR),
    new Point(11, 12, Point.prototype.TYPE_FINISH),
    new Point(11, 13, Point.prototype.TYPE_ELEVATOR)
];
  */
var pathList = [];
var DIR_RIGHT = 'RIGHT';
var DIR_LEFT = 'LEFT';

var k =0;

getPath(0, startPos, DIR_RIGHT, nbAdditionalElevators);
console.log('pathList', pathList.length);
/*
for(var i=0; i<pathList.length; i++) {
    var info = getPathInfo(0, startPos, pathList[i]);
    console.log(i, 'len: ', info.len, 'clone: ', info.clone, 'rounds: ', info.rounds)
}
*/
console.log('getPath', k)
var op = getOptimalPath(0, startPos);
console.log(getPathInfo(0, startPos, op));
printPath(0, startPos, op);



function getPath(floor, pos, direction, elevatorRezerv, path) {
    k++;
    path = path || [];
    var floorPoints = getPointsOnFloor(floor);

    if(floor > exitFloor) return;
    if(getPathInfo(0, startPos, path).rounds > nbRounds) return;

    if(floorPoints) {
        var neighborPoint;

        // Get Right Point
        neighborPoint = getNeighborPoint(floorPoints, pos, DIR_RIGHT);
        if(neighborPoint && (isFreePoint(floorPoints, pos) || pos == neighborPoint.pos)) {

            var pathCopy = copyArray(path);
            var prevPathLength = path.length;
            pathCopy = addPointToPath(pathCopy, neighborPoint, pos, direction);
            if(neighborPoint.type == Point.prototype.TYPE_FINISH) return pathList.push(pathCopy);
            getPath(floor+1,
                neighborPoint.pos,
                (pathCopy.length - prevPathLength == 2) ? changeDirection(direction) : direction,
                elevatorRezerv,
                pathCopy);
        }
        // Get Left Point
        neighborPoint = getNeighborPoint(floorPoints, pos, DIR_LEFT);
        if(neighborPoint && (isFreePoint(floorPoints, pos) || pos == neighborPoint.pos)) {
            var pathCopy = copyArray(path);
            var prevPathLength = path.length;
            pathCopy = addPointToPath(pathCopy, neighborPoint, pos, direction);
            if(neighborPoint.type == Point.prototype.TYPE_FINISH) return pathList.push(pathCopy);
            getPath(floor+1,
                neighborPoint.pos,
                (pathCopy.length - prevPathLength == 2) ? changeDirection(direction) : direction,
                elevatorRezerv,
                pathCopy);
        }
    }

    // Add Elevator
    if(elevatorRezerv) {
        var floorK = 1;
        var nextFloorPoints = getPointsOnFloor(floor + floorK);
        var nextElevatorPoints = getPointsByType(nextFloorPoints, Point.prototype.TYPE_ELEVATOR);
        nextElevatorPoints =  nextElevatorPoints ? nextElevatorPoints.concat(getPointsByType(nextFloorPoints, Point.prototype.TYPE_FINISH)) : getPointsByType(nextFloorPoints, Point.prototype.TYPE_FINISH);

        while( (floor + floorK) < nbFloors && floorK < (nbAdditionalElevators+1)) {
            if(nextElevatorPoints) {
                var range = getFreePosRange(floorPoints, pos);
                for (var i = 0; i < nextElevatorPoints.length; i++) {
                    var point = nextElevatorPoints[i];
                    if (point && point.pos >= range.from && point.pos <= range.to) {
                        var pathCopy = copyArray(path);
                        var prevPathLength = path.length;
                        var newElevator = new Point(floor, point.pos, Point.prototype.TYPE_ELEVATOR, 'ELEVATOR');
                        pathCopy = addPointToPath(pathCopy, newElevator, pos, direction);
                        getPath(floor + 1,
                            newElevator.pos,
                            (pathCopy.length - prevPathLength == 2) ? changeDirection(direction) : direction,
                            elevatorRezerv - 1,
                            pathCopy);
                    }
                }
            }

            floorK++;
            nextFloorPoints = getPointsOnFloor(floor + floorK);
            nextElevatorPoints = getPointsByType(nextFloorPoints, Point.prototype.TYPE_ELEVATOR);
            nextElevatorPoints =  nextElevatorPoints ? nextElevatorPoints.concat(getPointsByType(nextFloorPoints, Point.prototype.TYPE_FINISH)) : getPointsByType(nextFloorPoints, Point.prototype.TYPE_FINISH);
        }
    }

    return path;
}
function copyArray(a) {
    return a.slice();
}
function getPointsByType(floorPoints, type) {
    var result = [];
    var flag = false;
    for(var i=0; i<floorPoints.length; i++) {
        var point = floorPoints[i];
        if(point.type == type) {
            flag = true;
            result.push(point);
        }
    }
    return flag ? result : null;
}
function getPointsOnFloor(floor) {
    var result = [];
    for(var i=0; i<points.length; i++) {
        var point = points[i];
        if(point.floor == floor) result.push(point);
    }
    return result;
}
function getNeighborPoint(floorPoints, pos, direction) {
    var leftElevators = [];
    var rightElevators = [];
    for(var i=0; i<floorPoints.length; i++) {
        var point = floorPoints[i];
        if(point.pos < pos) {
            leftElevators.push(point);
        } else {
            rightElevators.push(point);
        }
    }
    var leftElevator = null;
    var rightElevator = null;
    var max = -1/0;
    var min = 1/0;
    if(direction == DIR_LEFT) {
        for(var i=0; i<leftElevators.length; i++) {
            var point = leftElevators[i];
            if(point.pos > max) {
                max = point.pos;
                leftElevator = point;
            }
        }
        return leftElevator;
    } else {
        for(var i=0; i<rightElevators.length; i++) {
            var point = rightElevators[i];
            if(point.pos < min) {
                min = point.pos;
                rightElevator = point;
            }
        }
        return rightElevator;
    }
}
function isFreePoint(floorPoints, pos) {
    var result = true;
    for(var i=0; i<floorPoints.length; i++) {
        var point = floorPoints[i];
        if(point.pos == pos) result = false;
    }
    return result;
}
function addPointToPath(path, point, pos, direction) {
    if(pos < point.pos && direction == DIR_LEFT) {
        path.push(new Point(point.floor, pos, Point.prototype.TYPE_BLOCK, 'BLOCK'));
        path.push(point);
    } else if(pos > point.pos && direction == DIR_RIGHT) {
        path.push(new Point(point.floor, pos, Point.prototype.TYPE_BLOCK, 'BLOCK'));
        path.push(point);
    } else {
        path.push(point);
    }
    return path;
}
function changeDirection(direction) {
    return direction == DIR_LEFT ? DIR_RIGHT : DIR_LEFT;
}
function getFreePosRange(floorPoints, pos) {
    var leftElevator = getNeighborPoint(floorPoints, pos, DIR_LEFT);
    var rightElevator = getNeighborPoint(floorPoints, pos, DIR_RIGHT);
    var from = leftElevator ? leftElevator.pos+1 : 0;
    var to = rightElevator ? (rightElevator.pos != pos ? rightElevator.pos-1 : pos) : width - 1;
    return {from: from, to: to};
}
function getPathInfo(floor, pos, path) {
    var info = {
        len: 0,
        clone: 0,
        rounds: 0
    } ;
    for(var i=0; i<path.length; i++) {
        var point = path[i];
        if(point.action != 'WAIT') info.clone--;
        if(point.action != 'WAIT') info.rounds += 3;
        info.len += Math.abs(pos - point.pos) + Math.abs(floor - point.floor);
        pos = point.pos;
        floor = point.floor;
    }
    info.rounds += info.len;
    return info;
}
function getOptimalPath(startFloor, startPos) {
    var result;
    var min = 1/0;
    for(var i=0; i<pathList.length; i++) {
        var path = pathList[i];
        var info = getPathInfo(startFloor, startPos, path);
        if(info.rounds < min) {
            min = info.rounds;
            result = path;
        }
    }
    return result;
}

