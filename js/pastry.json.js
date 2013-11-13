/**
 * @description : extend for JSON
 * @filename    : pastry.json.js
 * @requires    : [pastry.js, pastry.array.js, pastry.date.js]
 * @refference  : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
 */
'use strict';

(function (PT) {
    PT.JSON = PT.tryAny([
            function () { return JSON;         },
            function () { return PT.OVEN.JSON; }
        ]);
    if (PT.isDef(PT.JSON)) {
        return;
    }

    var D2JSON = PT.DP.toJSON,
        S = PT.S;
    if (!PT.isFunc(D2JSON)) {
        [PT.SP, PT.NP, PT.BP].each(function (p) {
            p.toJSON = function () {
                return this.valueOf();
            };
        });
        D2JSON = function () {
            return isFinite(this.valueOf()) ? this.stringf('{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
        };
    }

    var gap, indent, rep, J = PT.JSON,
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
                return PT.isStr(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },
        str = function (key, holder) {
            var i, k, v, partial,
                mind = gap,
                value = holder[key];
            if (value && PT.isObj(value) && PT.isFunc(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (PT.isFunc(rep)) {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? S(value) : 'null';
                case 'boolean':
                case 'null':
                    return S(value);
                case 'object':
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (PT.OP.toString.apply(value) === '[object Array]') {
                        for (i = 0; i < value.length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = (partial.length === 0) ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && PT.isObj(rep)) {
                        rep.each(function (element) {
                            if (PT.isStr(element)) {
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
     * @syntax      : PT.JSON.stringify(value).
     */
    J.stringify = function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';
        rep = replacer;

        if (PT.isNum(space)) {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (PT.isStr(space)) {
            indent = space;
        }
        rep = replacer;
        if (replacer && !PT.isFunc(replacer) && (!PT.isObj(replacer) || !PT.isNum(replacer.length))) {
            throw new Error('JSON.stringify');
        }
        return str('', {'': value});
    };

    /**
     * @description : parse a string to JSON object
     * @param       : {string } string, string to parse
     * @return      : {unknown} result object.
     * @syntax      : PT.JSON.parse(string).
     */
    J.parse = function (text, reviver) {
        var j;
        function walk(holder, key) {
            var k, v,
                value = holder[key];
            if (value && PT.isObj(value)) {
                value.each(function (element, k) {
                    v = walk(value, k);
                    if (PT.isDef(v)) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                });
            }
            return reviver.call(holder, key, value);
        }
        text = S(text);
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
            return PT.isFunc(reviver) ? walk({'': j}, '') : j;
        }
        throw new SyntaxError('JSON.parse');
    };
}(PT));
