/**
 * @description : extend for JSON
 * @filename    : brick.json.js
 * @requires    : [brick.js, brick.validator.js, brick.origin.js]
 *
 * @refference  : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
 */
'use strict';

(function (BR, undefined) {
    BR.JSON = BR.JSON || {};
    var _originJSON = BR.origin.oneOf([
            function () { return JSON; },
            function () { return BR.GROUND.JSON; }
        ]);
    if (BR.isDefined(_originJSON)) {
        BR.JSON = _originJSON;
        return;
    }

    var gap, indent, rep,
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        _toJSON = function () {
            return this.valueOf();
        },
        quote = function (string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return BR.isString(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },
        str = function (key, holder) {
            var i, k, v, length, partial,
                mind = gap,
                value = holder[key];
            if (value && BR.isObject(value) && BR.isFunction(value.toJSON)) {
                value = value.toJSON(key);
            }
            if (BR.isFunction(rep)) {
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
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = (partial.length === 0) ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && BR.isObject(rep)) {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (BR.isString(rep[i])) {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = (partial.length === 0) ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

    String.prototype.toJSON  = String.prototype.toJSON  || _toJSON;
    Number.prototype.toJSON  = Number.prototype.toJSON  || _toJSON;
    Boolean.prototype.toJSON = Boolean.prototype.toJSON || _toJSON;
    Date.prototype.toJSON    = Date.prototype.toJSON    || function () {
        return isFinite(this.valueOf()) ? this.toFormatString('{YYY}-{MM}-{DD}T{hh}:{mm}:{ss}Z') : null;
    };

    BR.JSON.stringify = BR.JSON.stringify || function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';
        rep = replacer;

        if (BR.isNumber(space)) {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (BR.isString(space)) {
            indent = space;
        }
        if (replacer && !BR.isFunction(replacer) && (!BR.isObject(replacer) || !BR.isNumber(replacer.length))) {
            throw new Error('JSON.stringify');
        }
        return str('', {'': value});
    };
    BR.JSON.parse = BR.JSON.parse || function (text, reviver) {
        var j,
            walk = function (holder, key) {
                var k, v,
                    value = holder[key];
                if (value && BR.isObject(value)) {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            };
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
            /*jshint -W061 */ j = eval('(' + text + ')');
            return (BR.isFunction(reviver)) ? walk({'': j}, '') : j;
        }
        throw new SyntaxError('JSON.parse');
    };
}(BR));
