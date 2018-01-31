
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Zone = function (id, platinum) {
    this.id = id || 0;
    this.platinum = platinum || 0;
    this.linkedZones = {};

    this.ownerId = 0;
    this.myPODsCount = 0;
    this.enemyPODsCount = 0;
    this.visible = 0;

    this.destinations = {};
    this.visitCount = 0;
}

var World = function () {
    this.MAP = {};
}

World.prototype.getZone = function(id) {
    return this.MAP[id];
}

World.prototype.addZone = function (zone) {
    this.MAP[zone.id] = zone;
}

World.prototype.updateZone = function (id, ownerId, myPODsCount, enemyPODsCount, visible, platinum) {
    this.MAP[id].ownerId = ownerId;
    this.MAP[id].myPODsCount = myPODsCount;
    this.MAP[id].enemyPODsCount = enemyPODsCount;
    this.MAP[id].visible = visible;
    this.MAP[id].platinum = platinum;
}

World.prototype.increaseZoneVisitCount = function(id) {
    this.MAP[id].visitCount++;
}

World.prototype.addLink = function (zone1Id, zone2Id) {
    this.MAP[zone1Id].linkedZones[zone2Id] = 1;
    this.MAP[zone2Id].linkedZones[zone1Id] = 1;
}

World.prototype.calculateDestinations = function() {
    for(var zoneFrom in this.MAP) {
        for(var zoneTo in this.MAP) {
            if(zoneFrom.id != zoneTo) {

            }
        }
    }
}

World.prototype.goTo = function(zone1Id, zone2Id) {

}

World.prototype.getZoneWithPods = function() {
    var action = [];
    for(var zoneId in this.MAP) {
        var zone = this.MAP[zoneId];

        if(zone.myPODsCount > 0 && Object.keys(zone.linkedZones).length > 0) {
            var minPODsCount = 6;
            var PODs = 0;
            if(zone.id == myBase) {
                if(loopNumber > 20 && zone.myPODsCount < 4) continue;
                if(loopNumber > 40 && zone.myPODsCount < 16) continue;
                PODs = Math.round(zone.myPODsCount / 2);
            } else {
              PODs = zone.myPODsCount > minPODsCount ? Math.round(zone.myPODsCount / 2) : zone.myPODsCount;
            }

            var toZoneId = 0;
            var toZone1Id = Object.keys(zone.linkedZones)[getRandomInt(0, Object.keys(zone.linkedZones).length-1)];
            if(Object.keys(zone.linkedZones).length == 1) {
                toZoneId = toZone1Id;
            } else {
                var toZone2Id = Object.keys(zone.linkedZones)[getRandomInt(0, Object.keys(zone.linkedZones).length-1)];
                while(toZone1Id == toZone2Id) {
                    toZone2Id = Object.keys(zone.linkedZones)[getRandomInt(0, Object.keys(zone.linkedZones).length-1)];
                }
                var zone1 = W.getZone(toZone1Id);
                var zone2 = W.getZone(toZone2Id);
                toZoneId = Math.min(zone1.visitCount, zone2.visitCount) == zone1.visitCount ? zone1.id : zone2.id;
            }
            W.increaseZoneVisitCount(toZoneId);
            action.push( PODs + ' ' + zone.id + ' ' + toZoneId );
        }
    }
    return action.length > 0 ? action.join(' ') : 'WAIT';
}



z1 = new Zone(1,0);
z2 = new Zone(2,0);
z3 = new Zone(3,0);
w = new World();
w.addZone(z1);
w.addZone(z2);
w.addZone(z3);

w.addLink(z1.id, z2.id);
w.addLink(z2.id, z3.id);
w.calculateDestinations()

