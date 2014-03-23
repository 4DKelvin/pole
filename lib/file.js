'use strict';

var fs = require('fs');
var path = require('path');
var info = require('./info');
var config = require('./config');

var file = module.exports = {};

var basedir = process.cwd(),
    distDir,
    scriptDir,
    pageDir;

var pathSeparatorRe = /[\/\\]/g;
var jsExtRe = /\.js$/;

var mkdir = function(dirpath) {
    dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
        parts += part + '/';
        var subpath = path.resolve(parts);
        if (!fs.existsSync(subpath)) {
            try {
                fs.mkdirSync(subpath);
            } catch(e) {
                info.fatal(e);
            }
        }
        return parts;
    }, '');
};

file.initDist = function() {
    distDir = path.resolve(basedir, config('dist'));
    scriptDir = path.resolve(distDir, 'scripts');
    pageDir = path.resolve(distDir, 'pages');
    mkdir(distDir);
    mkdir(scriptDir);
    mkdir(pageDir);
};

file.readFile = function(filePath) {
    return fs.readFileSync(path.resolve(basedir, filePath), { encoding: config('encoding') });
};

file.writeScript = function(fileName, code) {
    fileName += (jsExtRe.test(fileName) ? '' : '.js');
    fileName = path.resolve(scriptDir, fileName);
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }
    try {
        fs.writeFileSync(fileName, code, { encoding: config('encoding') });
    } catch(e) {
        info.fatal(e);
    }
};

file.writePage = function(fileName, code) {
    var filePath = path.resolve(pageDir, path.dirname(fileName));
    mkdir(filePath);
    fileName = path.resolve(filePath, path.basename(fileName, '.html') + '.' + config('target'));
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }
    try {
        fs.writeFileSync(fileName, code, { encoding: config('encoding') });
    } catch(e) {
        info.fatal(e);
    }
};