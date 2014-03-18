'use strict';

var _ = require('lodash');

var INPUT_ELEMENT_TYPE_INVOKE = 'INVOKE',
    INPUT_ELEMENT_TYPE_CHOOSE = 'CHOOSE',
    INPUT_ELEMENT_TYPE_LOOP = 'LOOP',
    TOKEN_TYPE_VAR = 'VAR',
    TOKEN_TYPE_STRING = 'STRING',
    TOKEN_TYPE_IF = 'IF',
    TOKEN_TYPE_ELSEIF = 'ELSEIF',
    TOKEN_TYPE_ELSE = 'ELSE',
    TOKEN_TYPE_FOREACH = 'FOREACH',
    TOKEN_TYPE_FORIN = 'FORIN';

var SyntaxTree = module.exports = function() {
    this.isRoot = true;
    this.elements = [];
};
SyntaxTree.prototype = {
    constructor: SyntaxTree,
    addInputElement: function(options) {
        var ele = new InputElement(options);
        this.elements.push(ele);
        return ele;
    },
    addInvokeElement: function(options) {
        return this.addInputElement(_.defaults({ type: INPUT_ELEMENT_TYPE_INVOKE }, options));
    },
    addChooseElement: function(options) {
        return this.addInputElement(_.defaults({ type: INPUT_ELEMENT_TYPE_CHOOSE }, options));
    },
    addLoopElement: function(options) {
        return this.addInputElement(_.defaults({ type: INPUT_ELEMENT_TYPE_LOOP }, options));
    },
    createToken: function(options) {
        return new Token(options);
    },
    createVarToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_VAR }, options));
    },
    createStringToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_STRING }, options));
    },
    createIfToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_IF }, options));
    },
    createElseifToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_ELSEIF }, options));
    },
    createElseToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_ELSE }, options));
    },
    createForeachToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_FOREACH }, options));
    },
    createForinToken: function(options) {
        return this.createToken(_.defaults({ type: TOKEN_TYPE_FORIN }, options));
    }
};

var InputElement = function(options) {
    _.assign(this, options);
    this.tokens = this.tokens || [];
    if (!_.isArray(this.tokens)) {
        this.tokens = [this.tokens];
    }
};
InputElement.prototype = {
    constructor: InputElement,
    addToken: function(options) {
        var token;
        if (options.$isToken === true) {
            token = options;
        } else {
            token = new Token(options);
        }
        this.tokens.push(token);
        return token;
    }
};

var Token = function(options) {
    _.assign(this, options);
    if (this.type == TOKEN_TYPE_FOREACH) {
        this.status = this.status || 'status';
        this.condition = this.condition || {};
        this._defaults(this.condition, { begin: '0', step: '1' });
    }
};
Token.prototype = {
    constructor: Token,
    $isToken: true,
    addInputElement: SyntaxTree.prototype.addInputElement,
    addInvokeElement: SyntaxTree.prototype.addInvokeElement,
    addChooseElement: SyntaxTree.prototype.addChooseElement,
    addLoopElement: SyntaxTree.prototype.addLoopElement
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
    GROUP
    VAR
    NULL
    NUMBER
    BOOLEAN
    STRING

语法树示例
{
    "isRoot": true,
    "inputElements": [
        {
            "type": "INVOKE",
            "tokens": [
                {
                    "type": "STRING",
                    "data": "hello"
                },
                {
                    "type": "VAR",
                    "expression": "message"
                }
            ]
        },
        {
            "type": "CHOOSE",
            "tokens": [
                {
                    "type": "IF",
                    "condition": {
                        "type": "GROUP",
                        "operator": "",
                        "right": {
                            "type": "VAR",
                            "value": "name"
                        }
                    },
                    "inputElements": [
                        "type": "INVOKE",
                        "tokens": [
                            {
                                "type": "VAR",
                                "expression": "name"
                            }
                        ]
                    ]
                },
                {
                    "type": "ELSEIF",
                    "condition": {
                        "type": "GROUP",
                        "operator": ">",
                        "left": {
                            "type": "VAR",
                            "value": "size"
                        },
                        "right": {
                            "type": "NUMBER",
                            "value": "10"
                        }
                    },
                    "inputElements": [
                        "type": "INVOKE",
                        "tokens": [
                            {
                                "type": "STRING",
                                "data": "bbb"
                            }
                        ]
                    ]
                },
                {
                    "type": "ELSE",
                    "inputElements": [
                        "type": "INVOKE",
                        "tokens": [
                            {
                                "type": "STRING",
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
                    "type": "FOREACH",
                    "items": "list",
                    "item": "item",
                    "status": "status",
                    "condition": {
                        "begin": 0,
                        "end": "",
                        "step": "1"
                    },
                    "inputElements": [
                        {
                            "type": "CHOOSE",
                            "tokens": [
                                {
                                    "type": "IF",
                                    "condition": {

                                    },
                                    "inputElements": [
                                        "type": "INVOKE",
                                        "tokens": [
                                            {
                                                "type": "STRING",
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
                                    "type": "STRING",
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
                    "type": "FORIN",
                    "items": "",
                    "var": "",
                    "inputElements": [
                        {
                            "type": "CHOOSE",
                            "tokens": [
                                {
                                    "type": "IF",
                                    "condition": {

                                    },
                                    "inputElements": [
                                        "type": "INVOKE",
                                        "tokens": [
                                            {
                                                "type": "STRING",
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
                                    "type": "STRING",
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