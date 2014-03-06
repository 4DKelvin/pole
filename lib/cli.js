'use strict';

var info = require('./info');
var pole = require('./pole');

exports.run = function(argv) {
    var option = argv[2];
    if (option === '-v' || option === '--version') {
        info.version();
    } if (argv.length < 3 || option === '-h' || option === '--help') {
        info.help();
    } else if (option === 'compile') {
        pole.cli();
    } else {
        info.help();
    }
};