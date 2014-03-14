'use strict';

var path = require('path');
var _ = require('lodash');
var config = require('./config');
var file = require('./file');

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

template.compile = function(name) {
    var tpl = template.get(name),
        code;
    if (tpl) {
        if (_.isUndefined(tpl.code)) {
            compiler = compiler || require('pole-compile-' + config('target'));
            parser = parser || require('pole-adapt-' + tpl.engine);
            code = compiler.compile(parser.parse(tpl.content));
            tpl.code = code;
        } else {
            code = tpl.code;
        }
    }
    return code || '';
};

/*

模板解析规则

InputElement类型
    CHOOSE  条件选择
    LOOP    迭代
    INVOKE  执行

InputElement的Token
    CHOOSE
        IF      满足条件时输出
        ELSEIF  满足条件时输出
        ELSE    所有条件不满足时输出
    LOOP
        FOREACH 循环数组
        FORIN   循环对象
    INVOKE
        VAR     调用变量，输出变量值
        STRING  直接输出字符串内容

运算符
() [] . < > <= >= == != === !== && ||

操作符类型
    IDENTIFIER
    NULL
    NUMBER
    BOOLEAN
    STRING
    GROUP

语法树
{
    "isRoot": true,
    "inputElements": [
        {
            "type": "INVOKE",
            "tokens": [
                {
                    "name": "STRING",
                    "data": "hello"
                },
                {
                    "name": "VAR",
                    "expression": "message"
                }
            ]
        },
        {
            "type": "CHOOSE",
            "tokens": [
                {
                    "name": "IF",
                    "condition": [
                        {
                            "operator": "",
                            "rightOperator": {
                                "type": "IDENTIFIER",
                                "value": "name"
                            }
                        }
                    ],
                    "inputElements": [
                        "type": "INVOKE",
                        "tokens": [
                            {
                                "name": "VAR",
                                "expression": "name"
                            }
                        ]
                    ]
                },
                {
                    "name": "ELSEIF",
                    "condition": [
                        {
                            "operator": ">",
                            "leftOperator": {
                                "type": "IDENTIFIER",
                                "value": "size"
                            },
                            "rightOperator": {
                                "type": "NUMBER",
                                "value": "10"
                            }
                        }
                    ],
                    "inputElements": [
                        "type": "INVOKE",
                        "tokens": [
                            {
                                "name": "STRING",
                                "data": "bbb"
                            }
                        ]
                    ]
                },
                {
                    "name": "ELSE",
                    "inputElements": [
                        "type": "INVOKE",
                        "tokens": [
                            {
                                "name": "STRING",
                                "data": "ccc"
                            }
                        ]
                    ]
                }
            ]
        },
        {
            "type": "LOOP",
            "tokens": [
                {
                    "name": "FOREACH",
                    "items": "list",
                    "var": "item",
                    "varStatus": "status",
                    "condition": [
                        {
                            "begin": 0,
                            "end": "",
                            "step": "1"
                        }
                    ],
                    "inputElements": [
                        {
                            "type": "CHOOSE",
                            "tokens": [
                                {
                                    "name": "IF",
                                    "condition": [
                                        {

                                        }
                                    ],
                                    "inputElements": [
                                        "type": "INVOKE",
                                        "tokens": [
                                            {
                                                "name": "STRING",
                                                "data": "ddd"
                                            }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "INVOKE",
                            "tokens": [
                                {
                                    "name": "STRING",
                                    "data": "eee"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "LOOP",
            "tokens": [
                {
                    "name": "FORIN",
                    "items": "",
                    "var": "",
                    "inputElements": [
                        {
                            "type": "CHOOSE",
                            "tokens": [
                                {
                                    "name": "IF",
                                    "condition": [
                                        {

                                        }
                                    ],
                                    "inputElements": [
                                        "type": "INVOKE",
                                        "tokens": [
                                            {
                                                "name": "STRING",
                                                "data": "ddd"
                                            }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "INVOKE",
                            "tokens": [
                                {
                                    "name": "STRING",
                                    "data": "eee"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

*/