'use strict';

var pkg = require('../package.json');

exports.version = function() {
    console.log('Pole v' + pkg.version);
};

exports.help = function() {
    [
        '',
        '  Usage: pole <command>',
        '',
        '  Commands:',
        '',
        '    compile            ',
        '',
        '  Options:',
        '',
        '    -h, --help         Display this help text.',
        '    -v, --version      Print the grunt version.',
        ''
    ].forEach(function(str) { console.log(str); });
};

exports.fatal = function(e) {
    console.log('Fatal error: ' + (e.message || e));
    process.exit(1);
};