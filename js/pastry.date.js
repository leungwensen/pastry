/**
 * @description : extend for Date
 * @filename    : pastry.date.js
 * @requires    : []
 */
'use strict';

(function (PT) {
    var dp = PT.DP,
        f = function (n) {
            return n < 10 ? '0' + n : n;
        },
        lms = function (ms) {
            var str = ms.toString(),
                len = str.length;
            return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
        };
    /**
     * @description : return stringified date according to given pattern.
     * @param       : {string} pattern, defines pattern for stringify.
     * @return      : {string} result string.
     * @syntax      : date.stringf([pattern])
     * @example     : '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
     * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
     * @example     : '{YY}-{M}-{D} {h}:{m}:{s}' => '13-10-3 0:57::13'
     */
    dp.stringf = function (pattern) {
        var y, mo, d, h, mi, s, ms;
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
        return pattern.replace( '{YYYY}', y = PT.S(this.getFullYear())     )
                      .replace( '{MM}'  , f(mo   = this.getMonth() + 1   ) )
                      .replace( '{DD}'  , f(d    = this.getDate()        ) )
                      .replace( '{hh}'  , f(h    = this.getHours()       ) )
                      .replace( '{mm}'  , f(mi   = this.getMinutes()     ) )
                      .replace( '{ss}'  , f(s    = this.getSeconds()     ) )
                      .replace( '{lms}' , lms(ms = this.getMilliseconds()) )
                      .replace( '{YY}'  , y.substring(2) )
                      .replace( '{M}'   , mo )
                      .replace( '{D}'   , d  )
                      .replace( '{h}'   , h  )
                      .replace( '{m}'   , mi )
                      .replace( '{s}'   , s  )
                      .replace( '{ms}'  , ms );
    };
}(PT));
