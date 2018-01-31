/*
 REPLACE
 */
var print = function (val) {
    console.log(val)
}

/*
 S = readline().toUpperCase();
 map = {A:'4',B:'8',C:'(',D:'|)',E:'3',F:'|=',G:'6',H:'|-|',I:'!',J:'_|',K:'|<',L:'1',M:'/\\/\\',N:'|\\|',O:'0',P:'|>',Q:'9',R:'/2',S:'5',T:'7',U:'|_|',V:'\\/',W:'\\/\\/',X:'}{',Y:"'/",Z:'2'};
 for(r='',i=0; i<S.length; i++) {
 if(map[S[i]]) r += map[S[i]];
 else r+= S[i];
 }
 print(r);
 */

/*
 var n = parseInt(readline());
 var s = readline();
 m='abcdefghijklmnopqrstuvwxyz';
 a=[]
 pat=/(?![a-zA-Z])./;
 for(var i=0; i<s.length; i++) {
 if(pat.test(s[i])) {
 a.push(s[i]);
 printErr(s[i])
 } else {
 k=m.indexOf(s[i].toLowerCase());
 z = Math.abs(k-n) % m.length
 printErr(z)
 if(s[i]==s[i].toUpperCase()) a.push(m[z].toUpperCase());
 else  a.push(m[k-n]);

 }
 }

 print(a.join(''));
 */


function checkIndicator(indicator, from, len) {
    var s0 = indicator,
        s1 = (pad(from - 1) + pad(len, '1')),
        l = Math.max(s0.length, s1.length),
        i,
        b0, b1;

    s0 = (s0 + pad(l - s0.length)).match(/.{1,32}/g);
    s1 = (s1 + pad(l - s1.length)).match(/.{1,32}/g);

    for (i = s1.length; i--;) {
        b0 = parseInt(s0[i], 2);
        b1 = parseInt(s1[i], 2);
        if ((b0 & b1) != 0) return false;
    }
    return true;
}

function updateIndicator(indicator, from, len) {
    var s0 = indicator,
        s1 = (pad(from - 1) + pad(len, '1')),
        l = Math.max(s0.length, s1.length),
        i,
        resultString,
        b0, b1;

    s0 = (s0 + pad(l - s0.length)).match(/.{1,16}/g);
    s1 = (s1 + pad(l - s1.length)).match(/.{1,16}/g);
    indicator = '';
    for (i = s1.length; i--;) {
        l = s0[i].length;
        b0 = parseInt(s0[i], 2);
        b1 = parseInt(s1[i], 2);
        resultString = (b0 | b1).toString(2);
        indicator = pad(l - resultString.length) + resultString + indicator;
    }
    console.log(indicator)
    return indicator;
}

function pad(len, char) {
    char = char || '0';
    return new Array(len + 1).join(char);
}
//console.log(checkIndicator('1110000', 5, 3));
//console.log(updateIndicator('1110000', 5, 3))
//console.log(checkIndicator('1'+pad(997) + '0', 998, 2));
//console.log(updateIndicator('1'+pad(997) + '0', 998, 2));

console.log(checkIndicator('', 2, 5));
console.log(updateIndicator('', 2, 5));
