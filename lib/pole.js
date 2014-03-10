'use strict';

var config = require('./config');
var util = require('./util');
var list = require('./list');

var pole = module.exports = {};

var defaultConfigFile = 'pole.json';

function scr() {


}

pole.cli = function() {
    this.compile(util.readJSON(defaultConfigFile));
}

pole.compile = function(configs) {
    config.init(configs);

};
