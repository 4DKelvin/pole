'use strict';

var fs = require('fs');
var path = require('path');
var globule = require("globule");
var info = require('./info');

var pole = module.exports = {};

pole.basedir = process.cwd();

pole.cli = function() {
    var poleJson;
    try {
        poleJson = fs.readFileSync(pole.basedir + '/pole.json');
    } catch(e) {
        info.fatal(e);
    }
    try {
        poleJson = JSON.parse(poleJson);
    } catch(e) {
        info.fatal(e.message + ', ' + 'failed to parse \'pole.json\'');
    }
    this.compile(poleJson);
}

pole.compile = function(config) {
    console.log(globule.find(path.resolve(config.src[1])));
};
