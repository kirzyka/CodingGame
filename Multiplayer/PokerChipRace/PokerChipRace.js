require('../../com/CG')('./Multiplayer/PokerChipRace/data.txt', function() {

    function Chip(id, player, radius, x, y, vx, vy) {
        this.id = id;
        this.player = player;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.nextX = 0;
        this.nextY = 0;
    }

    function dist(x1, y1, x2, y2) {
        return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
    }


    var myId = parseInt(readline()); // your id (0 to 4)


    // game loop
    var myChips = [],
        myChip,
        instructions = [],
        otherChips = [],
        chip,
        maxRadius = -1/ 0,
        target,
        myChipCount = parseInt(readline()),
        allChipCount = parseInt(readline()),
        i, j;

    for (i = 0; i < allChipCount; i++) {
        var I = readline().split(' ');
        if(parseFloat(I[2]) > maxRadius) maxRadius = parseFloat(I[2]);
        if(I[1] == myId) {
            myChips.push(new Chip(parseInt(I[0]),parseInt(I[1]),parseFloat(I[2]),parseFloat(I[3]),parseFloat(I[4]),parseFloat(I[5]),parseFloat(I[6]) ));
        } else {
            otherChips.push(new Chip(parseInt(I[0]),parseInt(I[1]),parseFloat(I[2]),parseFloat(I[3]),parseFloat(I[4]),parseFloat(I[5]),parseFloat(I[6]) ));
        }
    }

    for (i = 0; i < myChipCount; i++) {
        myChip = myChips[i];
        var x1 = myChip.x - myChip.radius/2 - maxRadius / 2;
        var x2 = myChip.x + myChip.radius/2 + maxRadius / 2;
        var y1 = myChip.y - myChip.radius/2 - maxRadius / 2;
        var y2 = myChip.y + myChip.radius/2 + maxRadius / 2;
        var dangerChips = otherChips.filter(function(element, index) {
            return (element.x >= x1 || element.x <= x2) && (element.y >= y1 || element.y2 <= y2) && element.radius > myChip.radius;
        });
        var mostDangerChip = null;
        var dangerDist = 1/0;
        for(j = 0; j < dangerChips.length; j++) {
            var dangerChip = dangerChips[j];
            var d = dist(myChip.x + myChip.vx, myChip.y + myChip.vy, dangerChip.x + dangerChip.vx, dangerChip.y + dangerChip.vy);
            if(d < dangerDist && (dangerChip.vx != 0 || dangerChip.vy !=0)) {
                dangerDist = d;
                mostDangerChip = dangerChip;
            }
        }

        if(mostDangerChip) {
            if(mostDangerChip.vx == 0 && mostDangerChip.vy ==0) {
                instructions[i] = 'WAIT';
            } else if(mostDangerChip.vx < 0 && mostDangerChip.vy < 0) {
                instructions[i] = '799 0';
            } else if(mostDangerChip.vx < 0 && mostDangerChip.vy >= 0) {
                instructions[i] = '0 0';
            } else if(mostDangerChip.vx >= 0 && mostDangerChip.vy < 0) {
                instructions[i] = '799 514';
            } else {
                instructions[i] = '0 514';
            }
        } else {
            instructions[i] = 'WAIT';
        }
    }


    for (i = 0; i < myChipCount; i++) {
        print(instructions[i]);
    }

});
