/**
 * @description : formatting things
 * @filename    : pastry.format.js
 * @requires    : [pastry.js]
 */
'use strict';

(function (PT) {
    PT.FMT = {
        /**
         * @description : return stringified date according to given pattern.
         * @param       : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : date.stringf([pattern])
         * @example     : '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
         * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
         * @example     : '{YY}-{M}-{D} {h}:{m}:{s}' => '13-10-3 0:57::13'
         */
        date : function (date, pattern) {
            var y, mo, d, h, mi, s, ms,
                f = function (n) {
                    return n < 10 ? '0' + n : n;
                },
                lms = function (ms) {
                    var str = ms.toString(),
                        len = str.length;
                    return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
                };
            pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
            return pattern.replace( '{YYYY}', y = PT.S(date.getFullYear())     )
                          .replace( '{MM}'  , f(mo   = date.getMonth() + 1   ) )
                          .replace( '{DD}'  , f(d    = date.getDate()        ) )
                          .replace( '{hh}'  , f(h    = date.getHours()       ) )
                          .replace( '{mm}'  , f(mi   = date.getMinutes()     ) )
                          .replace( '{ss}'  , f(s    = date.getSeconds()     ) )
                          .replace( '{lms}' , lms(ms = date.getMilliseconds()) )
                          .replace( '{YY}'  , y.substring(2) )
                          .replace( '{M}'   , mo )
                          .replace( '{D}'   , d  )
                          .replace( '{h}'   , h  )
                          .replace( '{m}'   , mi )
                          .replace( '{s}'   , s  )
                          .replace( '{ms}'  , ms );
        },
        /**
         * @description : return stringified number according to given pattern.
         * @param       : {object} option, defines pattern for stringify.
         * @example     : {"comma": "1|0", "decimal": ">=0", "integer" : ">=0", "zero": "1|0"}
         * @return      : {string} result string.
         * @syntax      : number.stringf([option])
         */
        num : function (num, option) {
            var i, len, placeHolder,
                str    = num.toString(),
                strArr = str.split('.');
            option = option || {
                'comma'   : 1,
                'decimal' : 2,
                'integer' : 5,
                'zero'    : 0
            };
            placeHolder = (option.zero && option.zero > 0) ? '0' : ' ';
            if (option.decimal && option.decimal > 0) {
                strArr[1] = strArr[1] || '';
                strArr[1] = strArr[1].slice(0, option.decimal);
                len = option.decimal - strArr[1].length;
                for (i = 0; i < len; i ++) {
                    strArr[1] += '0';
                }
            }
            if (option.integer && option.integer > 0) {
                len = option.integer - strArr[0].length;
                for (i = 0; i < len; i ++) {
                    strArr[0] = placeHolder + strArr[0];
                }
            }
            if (option.comma && option.comma !== 0) {
                strArr[0] = strArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            if (strArr[1] !== '') {
                return strArr.join('.');
            }
            return strArr[0];
        }
    };
}(PT));
