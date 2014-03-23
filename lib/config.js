'use strict';

var path = require('path');
var _ = require('lodash');
var util = require('./util');

var config = module.exports = function(prop) {
    return config.get(prop);
};

config.data = {};

config.init = function(configs) {
    configs = configs || {};
    configs.src = !_.isArray(configs.src) ? [configs.src] : configs.src;
    configs.dist = configs.dist || '/';
    configs.fragmentDir = configs.fragmentDir || '/';
    configs.target = configs.target || 'jsp';
    configs.targetTemplate = configs.targetTemplate || '';
    configs.targetTemplateSpecs = configs.targetTemplateSpecs || {};
    configs.mockDir = path.dirname(path.resolve(util.basedir, configs.mockConfig));
    configs.mockConfig = util.readJSON(configs.mockConfig);
    configs.encoding = configs.encoding || 'utf8';
    config.data = configs;
};

config.get = function(prop) {
    prop = prop.split('.');
    var s = config.data;
    var val;
    _.each(prop, function(key) {
        val = s[key];
        s = val;
    });
    return val;
};