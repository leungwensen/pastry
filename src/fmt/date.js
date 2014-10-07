/* jshint strict: true, undef: true, unused: true */
/* global define */
define('fmt/date', [
    'pastry',
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - date
     */

    return function (date, pattern) {
        /**
         * @description : return stringified date according to given pattern.
         * @parameter*  : {date  } date, input Date object
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : date.stringf([pattern])
         * @example     :
        //     '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
        //     '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
        //     '{YY}-{M}-{D} {h}:{m}:{s}' => '13-10-3 0:57::13'
         */

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

        return pattern.replace( '{YYYY}', y = pastry.S(date.getFullYear())     )
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
    };
});
