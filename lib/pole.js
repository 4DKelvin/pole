'use strict';

var chalk = require('chalk');
var globule = require('globule');
var _ = require('lodash');

var config = require('./config');
var util = require('./util');
var file = require('./file');
var scriptBuilder = require('./scriptbuilder');
var htmlParser = require('./htmlparser');

var pole = module.exports = {};

var defaultConfigFile = 'pole.json';
var releaseScriptFilename = 'pole-release.js';

var createScript = function() {
    process.stdout.write('Creating "scripts/' + chalk.cyan(releaseScriptFilename) + '"');
    try {
        file.writeScript(releaseScriptFilename, scriptBuilder.build());
        process.stdout.write(' ...' + chalk.green('OK') + '\n');
    } catch (e) {
        process.stdout.write(' ...' + chalk.red('Failed') + '\n');
        throw e;
    }
};

var compileHTML = function() {
    var src = [];
    _.each(config('src'), function(p) {
        src = src.concat(globule.find(p));
    });
    src = _.uniq(src);
    _.each(src, function(p) {
        process.stdout.write('Compiling "' + chalk.cyan(p) + '"');
        try {
            file.writePage(p, htmlParser.parse(p));
            process.stdout.write(' ...' + chalk.green('OK') + '\n');
        } catch (e) {
            process.stdout.write(' ...' + chalk.red('Failed') + '\n');
            throw e;
        }
    });
};

pole.cli = function() {
    pole.compile(util.readJSON(defaultConfigFile));
};

pole.compile = function(configs) {
    config.init(configs);
    file.initDest();
    createScript();
    compileHTML();
};