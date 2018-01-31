var N = +readline();
var sections = [];

function isCross(section1, section2) {
    var s1, s2;
    if(Math.max(section1.len, section2.len) == section1.len) {
        s1 = section1;
        s2 = section2;
    } else {
        s1 = section2;
        s2 = section1;
    }
    return (s1.from <= s2.from && s1.to >= s2.from) ||
        (s1.to >= s2.to && s1.from <= s2.to);
}

function checkPreviousSections(section) {
    var flag = true;
    for(var i=0; i<sections.length; i++) {
        var prevSection = sections[i];
        if(isCross(section, prevSection)) {
            if(prevSection.len > section.len) {
                // remove prev
                sections.splice(i,1);
                i--;
            } else {
                // not add new
                flag = false;
                break;
            }
        }

    }
    return flag;
}


for (var i = 0; i < N; i++) {
    var I = readline().split(' ');
    var J = +I[0];
    var D = +I[1];
    if(checkPreviousSections({from: J, to: J+D-1, len: D})) {
        sections.push({from: J, to: J+D-1, len: D})
    }
}
/*var ind = [];
 for (var i = 0; i < sections.length; i++) {
 for(var j=sections[i].from; j<sections[i].to+1; j++) {
 if(!ind[j]) ind[j] = 0;
 ind[j]++;
 }
 }
 printErr(ind.join('').indexOf('2'))*/

print(sections.length)