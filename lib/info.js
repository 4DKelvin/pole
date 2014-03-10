'use strict';

var chalk = require('chalk');
var pkg = require('../package.json');

exports.version = function() {
    console.log(chalk.green('Pole v' + pkg.version));
};

exports.help = function() {
    [
        '',
        '  Usage: pole <command>',
        '',
        '  Commands:',
        '    compile            Compile .js files into .jsp or other suffix files of the same name.',
        '',
        '  Options:',
        '    -h, --help         Display this help text.',
        '    -v, --version      Print the grunt version.',
        ''
    ].forEach(function(str) { console.log(str); });
};

exports.fatal = function(e) {
    console.log(chalk.red('Fatal error: ' + (e.message || e)));
    process.exit(1);
};