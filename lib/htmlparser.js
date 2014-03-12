'use strict';

var config = require('./config');
var file = require('./file');
var template = require('./template');

var parser = module.exports = {};

var opemTagRe = /<!--\s*Pole(Template|Fragment)Tag\s(.*)\/(EndTag)?-->/,
    endTagRe = /<!--\s*\/EndTag\s*-->/,
    paramsRe = /(\w+)="([^=]*)"/gi,
    wrapRe = /\{\{content\}\}/;

var compiler;

var parseHtml = function(content) {
    var tail = content,
        matches,
        root = [],
        params;

    while (matches = tail.match(opemTagRe)) {
        root.push(tail.substr(0, matches.index));
        tail = tail.substr(matches.index + matches[0].length);
        params = parseParams(matches[2]);
        if (matches[1] === 'Template') {
            root.push(template.compile(params.name));
        } else if (matches[1] === 'Fragment') {
            matches = tail.match(endTagRe);
            tail = tail.substr(matches.index + matches[0].length);
            root.push(parseHtml(file.readFile(config('fragmentDir') + params.name + '.html')));
        }
    }
    root.push(tail);

    return root.join('');
};

var parseParams = function(str) {
    var result, params = {};
    while ((result = paramsRe.exec(str)) !== null) {
        params[result[1]] = result[2];
    }
    return params;
};

parser.parse = function(filePath) {
    var html, targetTemplate;
    compiler = compiler || require('pole-compile-' + config('target'));
    html = parseHtml(file.readFile(filePath));
    targetTemplate = config('targetTemplateSpecs')[filePath] || config('targetTemplate');
    targetTemplate = targetTemplate ? file.readFile(targetTemplate) : compiler.defaultTemplate;
    return targetTemplate.replace(wrapRe, html);
};