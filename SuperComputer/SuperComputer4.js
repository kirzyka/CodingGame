require('../com/CG')('./SuperComputer/data_test3.txt', function() {

    function calculate() {
        var N = +readline(),
            sections = [], section,
            position = 0,
            result = 0,
            i,
            I;

        for (i = N; i--;) {
            I = readline().split(' ');
            sections.push({from: parseInt(I[0]), len: parseInt(I[1])});
        }

        sections.sort(function(a, b) { return (a.from + a.len) - (b.from + b.len); });

        for (i = 0; i< N; i++) {
            section = sections[i];
            if(position == 0 || section.from  >= position) {
                result++;
                position = section.from + section.len;
            }
        }
        return result;
    }
    print(calculate());

});