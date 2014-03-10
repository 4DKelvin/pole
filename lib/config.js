'use strict';

var _ = require('lodash');
var util = require('./util');

var config = module.exports = function(prop) {
    return config.get(prop);
};

config.data = {};

config.init = function(configs) {
    configs = configs || {};
    configs.src = !_.isArray(configs.src) ? [configs.src] : configs.src;
    configs.dest = configs.dest || '/';
    configs.fragmentDir = configs.fragmentDir || '/';
    configs.target = configs.target || 'jsp';
    configs.targetTemplate = configs.targetTemplate || '';
    configs.targetTemplateSpecs = configs.targetTemplateSpecs || {};
    if (_.isString(configs.mockConfig)) {
        configs.mockConfig = util.readJSON(configs.mockConfig);
    }
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