'use strict';

var path = require('path');
var _ = require('lodash');
var config = require('./config');
var file = require('./file');
var SyntaxTree = require('pole-parser').SyntaxTree;

var breakRe = /[\f\n\r\v]/g,
    defaultTemplateEngine = 'mustache';

var compiler, parser;

var template = module.exports = function(name) {
    var tpl = template.get(name);
    return tpl ? tpl.content : '';
};

template.data = {};

template.get = function(name) {
    var templates = config('mockConfig.templates'),
        tpl,
        url,
        engine,
        content;
    if (!_.isUndefined(templates[name])) {
        tpl = template.data[name];
        if (!tpl) {
            url = templates[name];
            if (_.isString(url)) {
                engine = config('mockConfig.templateEngine') || defaultTemplateEngine;
            } else {
                url = url.url;
                engine = url.engine || config('mockConfig.templateEngine') || defaultTemplateEngine;
            }
            content = file.readFile(path.resolve(config('mockDir'), url));
            content = content.replace(breakRe, '');
            tpl = {
                engine: engine,
                content: content
            };
            template.data[name] = tpl;
        }
    }
    return tpl;
};

template.caches = {};

template.compile = function(name) {
    var tpl = template.get(name),
        code;
    if (tpl) {
        if (_.isUndefined(tpl.code)) {
            compiler = compiler || require('pole-compile-' + config('target'));
            parser = parser || require('pole-adapt-' + tpl.engine);
            var stt = new SyntaxTree();
            parser.parse(stt, tpl.content);
            code = compiler.compile(stt);
            tpl.code = code;
        } else {
            code = tpl.code;
        }
    }
    return code || '';
};