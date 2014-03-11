/*! pole-mock v0.0.1 ~ (c) 2014 Pole Team, https://github.com/polejs/pole-mock */
(function(window, undefined) {
    'use strict';

    var document = window.document;
    
    var slice = Array.prototype.slice;
    
    var formatString = function(str) {
        var args = slice.call(arguments, 1);
        return str.replace(/\{(\d+)\}/g, function(m, i) {
            return args[i];
        });
    };
    

    var pole = {
        // the version of pole-mock
        version: '0.0.1',

        // 默认模板引擎
        defaultTemplateEngine: 'mustache'
    };

    var actionMap = new HashMap();
    var templateMap = new HashMap();

    pole.putActions = function(actions, url) {
        var action, name;
        if (typeof actions === 'string') {
            action = {};
            action[actions] = url;
            pole.putActions(action);
            return;
        }
        for (name in actions) {
            actionMap.put(name, actions[name]);
        }
    };

    pole.action = function(name) {
        var url = actionMap.get(name);
        if (url) {
            return formatString.apply(null, [url].concat(slice.call(arguments, 1)));
        }
        return null;
    };

    pole.putTemplates = function(templates, content) {
        var tpl, name;
        if (typeof templates === 'string') {
            tpl = {};
            tpl[templates] = content;
            pole.putTemplates(tpl);
            return;
        }
        for (name in templates) {
            tpl = {};
            if (typeof templates[name] === 'string') {
                tpl.content = templates[name];
                tpl.engine = pole.defaultTemplateEngine;
            } else {
                tpl.content = templates[name].content;
                tpl.engine = templates[name].engine || pole.defaultTemplateEngine;
            }
            templateMap.put(name, tpl);
        }
    };

    pole.template = function(name) {
        var tpl = templateMap.get(name);
        if (tpl) {
            if (!tpl.renderer) {
                tpl.renderer = templateRenderer.create(tpl.engine, tpl.content);
            }
            return tpl.renderer;
        }
        return null;
    };

    pole.render = function(name, data) {
        var tpl = templateMap.get(name);
        if (tpl) {
            if (!tpl.renderer) {
                tpl.renderer = templateRenderer.create(tpl.engine, tpl.content);
            }
            return templateRenderer.render(tpl.engine, tpl.renderer, data);
        }
        return false;
    };

    // pole.action的快捷方法
    pole.url = pole.action;

    // pole.template的快捷方法
    pole.tpl = pole.template;

    

    function HashMap(keyFn) {
        this.map = {};
        this.length = 0;
        if (keyFn) {
            this.getKey = keyFn;
        }
    }

    HashMap.prototype.size = function() {
        return this.length;
    };

    HashMap.prototype.getKey = function(o) {
        return o.id;
    };

    HashMap.prototype.put = function(key, value) {
        if (value === undefined) {
            value = key;
            key = this.getKey(value);
        }

        if (!this.hasKey(key)) {
            ++this.length;
        }
        Object.defineProperty(this.map, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
        });

        return value;
    };

    HashMap.prototype.get = function(key) {
        return this.map[key];
    };

    HashMap.prototype.remove = function(key) {
        if (this.hasKey(key)) {
            delete this.map[key];
            --this.length;
            return true;
        }
        return false;
    };

    HashMap.prototype.clear = function() {
        this.map = {};
        this.length = 0;
        return this;
    };

    HashMap.prototype.hasKey = function(key) {
        return this.map[key] !== undefined;
    };

    HashMap.prototype.has = function(value) {
        var ret = false;
        this.each(function(key, val) {
            if (value === val) {
                ret = true;
                return false;
            }
        });
        return ret;
    };

    HashMap.prototype.keys = function() {
        return this.getData(true);
    };

    HashMap.prototype.values = function() {
        return this.getData(false);
    };

    HashMap.prototype.getData = function(isKey) {
        var arr = [];
        this.each(function(key, value) {
            arr.push(isKey ? key : value);
        });
        return arr;
    };

    HashMap.prototype.each = function(fn, scope) {
        var items = this.map,
            key,
            length = this.length;

        scope = scope || this;
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn.call(scope, key, items[key], length) === false) {
                    break;
                }
            }
        }
        return this;
    };

    HashMap.prototype.clone = function() {
        var map = new HashMap();
        this.each(function(key, value) {
            map.put(key,value);
        });
        return map;
    };

    

    function MustacheEngine() {
        this.nextHandler = null;
    }

    MustacheEngine.prototype.engine = 'mustache';

    MustacheEngine.prototype.handleRequest = function(method, args, fn) {
        if (args[0] === this.engine) {
            return fn.apply(this, args);
        } else {
            return this.nextHandler ? this.nextHandler[method].apply(this.nextHandler, args) : false;
        }
    };

    MustacheEngine.prototype.compile = function() {
        return this.handleRequest('compile', slice.call(arguments, 0), function(engine, content) {
            Mustache.parse(content);
            return content;
        });
    };

    MustacheEngine.prototype.render = function() {
        return this.handleRequest('render', slice.call(arguments, 0), function(engine, tpl, data) {
            return Mustache.render(tpl, data);
        });
    };

    

    function DoTEngine() {
        this.nextHandler = null;
    }

    DoTEngine.prototype.engine = 'dot';

    DoTEngine.prototype.handleRequest = MustacheEngine.prototype.handleRequest;

    DoTEngine.prototype.compile = function() {
        return this.handleRequest('compile', slice.call(arguments, 0), function(engine, content) {
            return doT.template(content);
        });
    };

    DoTEngine.prototype.render = function() {
        return this.handleRequest('render', slice.call(arguments, 0), function(engine, tpl, data) {
            return tpl(data);
        });
    };

    

    var templateRenderer = {
        engines: {
            mustache: new MustacheEngine(),
            doT: new DoTEngine()
        },

        handle: function(method, args) {
            var handler = this.engines.mustache;
            if (args && args[0]) {
                args[0] = args[0].toLowerCase();
                return handler[method].apply(handler, args);
            }
            return false;
        },

        create: function(engine, content) {
            return this.handle('compile', slice.call(arguments, 0));
        },

        render: function(engine, renderer, data) {
            return this.handle('render', slice.call(arguments, 0));
        }
    };

    templateRenderer.engines.mustache.nextHandler = templateRenderer.engines.doT;

    

    (function() {
        var scripts = document.getElementsByTagName('script'),
            mockScriptNode,
            configUrl,
            mainScriptSrc,
            mainScriptNode;

        var mainInit = function() {
            if (mainScriptSrc) {
                mainScriptNode = document.createElement('script');
                mainScriptNode.src = suffix(mainScriptSrc, 'js');
                mainScriptNode.type = 'text/javascript';
                if (mockScriptNode.nextSibling) {
                    mockScriptNode.parentNode.insertBefore(mainScriptNode, mockScriptNode.nextSibling);
                } else {
                    mockScriptNode.parentNode.appendChild(mainScriptNode);
                }
            }
        };

        if (scripts) {
            for (var i = 0, len = scripts.length; i < len; i++) {
                if (/pole\-mock\.js$/.test(scripts[i].src)) {
                    mockScriptNode = scripts[i];
                    configUrl = mockScriptNode.getAttribute('data-config');
                    mainScriptSrc = mockScriptNode.getAttribute('data-main');
                    break;
                }
            }
            if (pole.mockMode === true && configUrl) {
                pole.initMock(configUrl, mainInit);
            } else {
                mainInit();
            }
        }
    }());


    if (typeof define === 'function') {
        define('pole', [], function() { return pole; });
    }

    if (typeof window === 'object' && typeof document === 'object') {
        window.pole = pole;
    }

}(window));