require('../com/CG')('./SuperComputer/data_test_my_1.txt', function() {

    function MAP(indicator, count) {
        this.indicator = indicator || '';
        this.count = count || 0;
    }

    function pad(len, char) {
        char = char || '0';
        return new Array(len+1).join(char);
    }

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
        return indicator;
    }

    function calculate() {
        var N = +readline(),
            sections = [], section,
            maps = [], newMaps = [], map,
            i, j,
            max = -1/ 0,
            S,
            I,
            J,
            D;

        maps.push(new MAP());

        for (i = N; i--;) {
            S = readline();
            I = S.split(' ');
            J = parseInt(I[0]);
            D = parseInt(I[1]);
            sections.push({from: J, len: D});
        }
        printErr('Sections was filled');
        sections.sort(function(a, b) { return a.len < b.len; });
        printErr('Sections was sorted');

        for (i = N; i--;) {
            section = sections[i];
            newMaps = [];
            for (j = maps.length; j--;) {
                map = maps[j];
                if (checkIndicator(map.indicator, section.from, section.len)) {
                    if(map.count + 1 > max) max = map.count + 1;
                    newMaps.push(new MAP(updateIndicator(map.indicator, section.from, section.len), map.count + 1));
                }
            }
            maps = maps.concat(newMaps);
            printErr('maps', maps.length);
        }

        return max;
    }

    print(calculate());

});