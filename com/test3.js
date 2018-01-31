console.log('start');
//var bigArray = Array.from(new Array(300000), function (val,index) { return index+10000000000; });
//var smallerArray = Array.from(new Array(50000), function (val,index) { return index+10000050000; });
var bigArray = [1,2,2,3,4,5];
var smallerArray = [1,3,6,6,8];

var results, timeMarker;
var ArrayUtils = {};
// but keep in mind that A could have duplicates, so we do a while loop to remove duplicates
ArrayUtils.importDiff = (a, b) => {
	var i, index;

	for (i = b.length - 1; i >= 0; i--) {
		index = a.indexOf(b[i]);
		if (index > 0) {
			a.splice(index, 1);
		}
		/*while ( index >= 0 ) {
		 	a.splice(index,1);
		 	index = a.indexOf(b[i]);
		}*/
	}

	return a;
};

ArrayUtils.importDiff2 = (a, b) => {
    var tmp = {}, diff = [], k, i;

    for (i = 0; i < a.length; i++) {
        tmp[a[i]] = true;
    }

    for (i = 0; i < b.length; i++) {
        if (tmp[b[i]]) {
            delete tmp[b[i]];
        }/*else {
            tmp[b[i]] = true;
        }*/
    }

    for (k in tmp) {
        diff.push(k);
    }

    return diff;
};

ArrayUtils.importDiff3 = (a, b) => {
	return a.filter(function(i) {return b.indexOf(i) < 0;});
};

console.log('initiated');

timeMarker = new Date().getTime();
//results = ArrayUtils.importDiff(bigArray, smallerArray);
results = ArrayUtils.importDiff(bigArray, smallerArray);
console.log('len', results);
console.log(new Date().getTime() - timeMarker);