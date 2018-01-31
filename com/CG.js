function CG(fileName, runFunc) {
    var fs = require('fs');

    try {
        fs.readFile(fileName, 'utf8', function (err, data) {
            var line = 0;
            var lines = data.split(/\n/gm);

            GLOBAL.readline = function() {
                return lines[line++];
            };

            GLOBAL.print = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift("OUTPUT: ");
                console.log.apply(console, args);
            };

            GLOBAL.printErr = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift("DEBUG:  ");
                console.log.apply(console, args);
            };

            runFunc();
        });
    } catch(e) {
        throw new Error('Data file not found!');
    }
}
module.exports = CG;