'use strict';

var path = require('path');
var _ = require('lodash');
var config = require('./config');
var file = require('./file');

var breakRe = /[\f\n\r\v]/g;

var template = module.exports = function(name) {
    return template.get(name);
};

template.data = {};

template.get = function(name) {
    var templates = config('mockConfig.templates');
    var content;
    if (!_.isUndefined(templates[name])) {
        content = template.data[name];
        if (!content) {
            content = file.readFile(path.resolve(config('mockDir'), templates[name]));
            content = content.replace(breakRe, '');
            template.data[name] = content;
        }
    }
    return content;
};