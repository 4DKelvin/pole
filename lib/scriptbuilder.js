'use strict';

var _ = require('lodash');
var config = require('./config');
var file = require('./file');
var template = require('./template');

var builder = module.exports = {};

var breakRe = /[\f\n\r\v]/g;

builder.buildActions = function(code) {
    var actions = config('mockConfig.actions');
    _.each(actions, function(url, action) {
        code.push('    pole.putActions(\'' + action + '\', \'' + (_.isString(url) ? url : url.url) + '\');');
    });
};

builder.buildTemplates = function(code) {
    var templates = config('mockConfig.templates');
    _.each(templates, function(filepath, name) {
        code.push('    pole.putTemplates(\'' + name + '\', \'' + template(name).replace(breakRe, '') + '\');');
    });
};

builder.build = function() {
    var content = file.readFile(config('poleCoreFile'));
    var code = [];

    code.push('', '');
    code.push('(function(window) {');
    code.push('    var pole = window.pole;');
    code.push('');
    builder.buildActions(code);
    code.push('');
    builder.buildTemplates(code);
    code.push('');
    code.push('}(window));');

    content += code.join('\n');
    return content;
};