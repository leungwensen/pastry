/**
 * @description : PT.QueryStr
 * @filename    : pastry.querystring.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    var unescape = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        },
        escape   = encodeURIComponent;

    PT.QueryStr = {
        /*
         * @description : override default encoding method
         * @syntax      : PT.QueryStr.escape(str)
         * @param       : {String} str, unescaped string.
         * @return      : {String} escaped string.
         */
        escape   : escape,

        /*
         * @description : override default decoding method
         * @syntax      : PT.QueryStr.unescape(str)
         * @param       : {String} str, escaped string.
         * @return      : {String} unescaped string.
         */
        unescape : unescape,

        /*
         * @description : accept query strings and return native javascript objects.
         * @syntax      : PT.QueryStr.parse(str)
         * @param       : {String} str, query string to be parsed.
         * @return      : {Object} parsed object.
         */
        parse : function (qs, sep, eq) {
            sep = sep || "&";
            eq  = eq  || "=";
            var tuple,
                obj = {},
                pieces = qs.split(sep);

            pieces.each(function (elem) {
                tuple = elem.split(eq);
                if (tuple.length > 0) {
                    obj[unescape(tuple.shift())] = unescape(tuple.join(eq));
                }
            });
            return obj;
        },

        /*
         * @description : converts an arbitrary value to a query string representation.
         * @syntax      : PT.QueryStr.stringify(obj)
         * @param       : {object} obj, object to be stringified
         * @return      : {String} query string.
         */
        stringify : function (obj, c) {
            var qs = [],
                s = c && c.arrayKey ? true : false;

            obj.each(function (value, key) {
                if (PT.isArr(value)) {
                    value.each(function (elem) {
                        qs.push(escape(s ? key + '[]' : key) + '=' + escape(elem));
                    });
                }
                else {
                    qs.push(escape(key) + '=' + escape(value));
                }
            });
            return qs.join('&');
        }
    };
}(PT));
