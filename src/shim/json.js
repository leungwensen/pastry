/* jshint strict: true, undef: true, unused: true */
/* global define */
define('shim/json', [
    'pastry',
    'fmt/date'
], function(
    pastry,
    fmtDate
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : shim 模块 - JSON
     * @reference   : https://github.com/douglascrockford/JSON-js
     */

    if (JSON && !!JSON.parse && !!JSON.stringify) {
        return JSON;
    }

    // 补全基础数据类型的 toJSON 方法 {
        var D2JSON = Date.prototype.toJSON;

        if (!pastry.isFunction(D2JSON)) {
            pastry.each([
                String.prototype,
                Number.prototype,
                Boolean.prototype
            ], function (p) {
                p.toJSON = function () {
                    return this.valueOf();
                };
            });
            D2JSON = function () {
                return isFinite(this.valueOf()) ? fmtDate(this, '{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
            };
        }
    // }

    var gap, indent, rep,
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },

        quote = function (string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return pastry.isString(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },

        str = function (key, holder) {
            var v, partial,
                mind = gap,
                value = holder[key];

            if (value && pastry.isFunction(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (pastry.isFunction(rep)) {
                value = rep.call(holder, key, value);
            }
            switch (true) {
                case pastry.isString(value):
                    return quote(value);
                case pastry.isNumber(value):
                    return isFinite(value) ? value + '' : 'null';
                case pastry.isObject(value):
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (pastry.isArray(value)) {
                        pastry.each(value, function (item, index) {
                            partial[index] = str(index, value) || 'null';
                        });
                        v = (partial.length === 0) ?
                            '[]' :
                            gap ?
                                '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                                '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && pastry.isObject(rep)) {
                        pastry.each(rep, function (element) {
                            if (pastry.isString(element)) {
                                v = str(element, value);
                                if (v) {
                                    partial.push(quote(element) + (gap ? ': ' : ':') + v);
                                }
                            }
                        });
                    } else {
                        pastry.each(value, function (element, k) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        });
                    }
                    v = (partial.length === 0) ?
                        '{}' :
                        gap ?
                            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                            '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                default :
                    return value + '';
            }
        },

        shim = {
            stringify: function (value, replacer, space) {
                /**
                 * @description : stringify a JSON object.
                 * @param       : {unknown} value, value to be stringified
                 * @return      : {string } result string.
                 * @syntax      : JSON.stringify(value).
                 */
                var i;
                gap = '';
                indent = '';
                rep = replacer;

                if (pastry.isNumber(space)) {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                } else if (pastry.isString(space)) {
                    indent = space;
                }
                rep = replacer;
                if (
                    replacer &&
                    !pastry.isFunction(replacer) && (
                        !pastry.isObject(replacer) ||
                        !pastry.isNumber(replacer.length)
                    )
                ) {
                    pastry.ERROR('JSON.stringify');
                }
                return str('', {'': value});
            },

            parse: function (text, reviver) {
                /**
                 * @description : parse a string to JSON object
                 * @param       : {string } string, string to parse
                 * @return      : {unknown} result object.
                 * @syntax      : JSON.parse(string).
                 */
                var j;

                function walk(holder, key) {
                    var v,
                        value = holder[key];

                    if (value && pastry.isObject(value)) {
                        pastry.each(value, function (element, k) {
                            v = walk(value, k);
                            if (v) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        });
                    }
                    return reviver.call(holder, key, value);
                }

                text = text + '';
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(
                    text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
                )) {
                    /* jshint -W061 */ j = eval('(' + text + ')');
                    return pastry.isFunction(reviver) ? walk({'': j}, '') : j;
                }
                pastry.ERROR('JSON.parse');
            }
        };

    pastry.setGLOBAL('JSON', shim);
    return shim;
});
