'use strict';

var path = require('path');
var globule = require("globule");

var config = require('./config');

module.exports = {
    init: function() {
        console.log(globule.find(path.resolve(config('src')[0])));
    }
};