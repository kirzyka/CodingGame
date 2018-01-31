var z = 0;

function readline() {
    var str = lines.split('\n')[z].trim();
    z++;
    return str;
}
function print() {
    // 1. Convert args to a normal array
    var args = Array.prototype.slice.call(arguments);
    // 2. Prepend log prefix log string
    args.unshift("OUTPUT: ");
    // 3. Pass along arguments to console.log
    console.log.apply(console, args);
}
function printErr() {
    // 1. Convert args to a normal array
    var args = Array.prototype.slice.call(arguments);
    // 2. Prepend log prefix log string
    args.unshift("DEBUG:  ");
    // 3. Pass along arguments to console.log
    console.log.apply(console, args);
}

function pad(lenght, char) {
    char = char || '0';
    return new Array(lenght + 1).join(char);
}

function copyArray(a) {
    return a.slice();
}
//----------------------------------------------

/*var lines = '\
 4\n\
 2 5\n\
 9 7\n\
 15 6\n\
 9 3';*/

/*var lines = '\
5\n\
3 5\n\
9 2\n\
24 5\n\
16 9\n\
11 6';*/

var lines = '\
3\n\
1 3\n\
2 3\n\
7 3';
//----------------------------------------------

function find(index, indicator, count) {
    k++;
    var tmpIndicator;
    tmpIndicator = copyArray(indicator);

    if (index == sections.length) {
        if (checkIndicator(indicator)) {
            if (count > result) result = count;
        }
    } else {
        // ignor
        find(index+1, indicator, count);

        // add if not cross
        tmpIndicator = updateIndicator(tmpIndicator, sections[index].from, sections[index].to);
        if (checkIndicator(tmpIndicator)) {
            find(index+1, tmpIndicator, ++count);
        }
    }
}

function updateIndicator(indicator, from, to) {
    var i;
    for (i = from; i < to + 1; i++) {
        if (!indicator[i]) indicator[i] = 0;
        indicator[i]++;
    }
    console.log(indicator)
    return indicator;
}

function checkIndicator(indicator) {
    var i;
    for (i = 0; i < indicator.length; i++) {
        if(indicator[i] > 1) { return false; }
    }
    return true;
}

var N = +readline(),
    sections = [],
    result = 0,
    k = 0,
    i,
    S,
    I,
    J,
    D;

for (i = N; i--;) {
    S = readline();
    I = S.split(' ');
    J = +I[0];
    D = +I[1];
    sections.push({from: J, to: J + D - 1, len: D});
}

sections.sort(function(a, b) {return a.len < b.len; });
find(0, [], 0);
print(result);
printErr(k)