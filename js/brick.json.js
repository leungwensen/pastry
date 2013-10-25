/**
 * @description : extend for JSON
 * @filename    : brick.json.js
 * @requires    : [brick.js, brick.validator.js, brick.origin.js, brick.array.js, brick.date.js]
 * @refference  : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
 */
'use strict';

(function (BR) {
    BR.JSON = BR.JSON || BR.origin.tryAny([
            function () { return JSON; },
            function () { return BR.GROUND.JSON; }
        ]);
    if (BR.isDef(BR.JSON)) {
        return;
    }

    var D2JSON = Date.prototype.toJSON;
    if (!BR.isFunc(D2JSON)) {
        [String.prototype, Number.prototype, Boolean.prototype].each(function (p) {
            p.toJSON = function () {
                return this.valueOf();
            };
        });
        D2JSON = function () {
            return isFinite(this.valueOf()) ? this.stringf('{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
        };
    }

    var gap, indent, rep, J = BR.JSON,
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
                return BR.isStr(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },
        str = function (key, holder) {
            var i, k, v, partial,
                mind = gap,
                value = holder[key];
            if (value && BR.isObj(value) && BR.isFunc(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (BR.isFunc(rep)) {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    for (i = 0; i < value.length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = (partial.length === 0) ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && BR.isObj(rep)) {
                    rep.each(function (element) {
                        if (BR.isStr(element)) {
                            k = element;
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    });
                } else {
                    value.each(function (element, k) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    });
                }
                v = (partial.length === 0) ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        };

    /**
     * @description : stringify a JSON object.
     * @param       : {unknown} value, value to be stringified
     * @return      : {string } result string.
     * @syntax      : BR.JSON.stringify(value).
     */
    J.stringify = J.stringify || function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';
        rep = replacer;

        if (BR.isNum(space)) {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (BR.isStr(space)) {
            indent = space;
        }
        rep = replacer;
        if (replacer && !BR.isFunc(replacer) && (!BR.isObj(replacer) || !BR.isNum(replacer.length))) {
            throw new Error('JSON.stringify');
        }
        return str('', {'': value});
    };

    /**
     * @description : parse a string to JSON object
     * @param       : {string } string, string to parse
     * @return      : {unknown} result object.
     * @syntax      : BR.JSON.parse(string).
     */
    J.parse = J.parse || function (text, reviver) {
        var j;
        function walk(holder, key) {
            var k, v,
                value = holder[key];
            if (value && BR.isObj(value)) {
                value.each(function (element, k) {
                    v = walk(value, k);
                    if (BR.isDef(v)) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                });
            }
            return reviver.call(holder, key, value);
        }
        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                                     .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                                     .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            /* jshint -W061 */ j = eval('(' + text + ')');
            return BR.isFunc(reviver) ? walk({'': j}, '') : j;
        }
        throw new SyntaxError('JSON.parse');
    };
}(BR));
