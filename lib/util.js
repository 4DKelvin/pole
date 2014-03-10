'use strict';

var fs = require('fs');
var path = require('path');
var info = require('./info');

var basedir = exports.basedir = process.cwd();

exports.readJSON = function(src) {
    var json;
    src = path.resolve(basedir + '/' + src);
    try {
        json = fs.readFileSync(src);
    } catch(e) {
        info.fatal(e);
    }
    try {
        json = JSON.parse(json);
    } catch(e) {
        info.fatal(e.message + ', ' + 'failed to parse \'' + src + '\'');
    }
    return json;
};