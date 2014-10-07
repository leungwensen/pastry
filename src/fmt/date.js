/* jshint strict: true, undef: true, unused: true */
/* global define */
define('fmt/date', [
    // 'pastry',
], function(
    // pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - date
     */

    // 私有函数 {
        function f (n) {
            return n < 10 ? '0' + n : n;
        }
        function lms (ms) {
            var str = ms + '',
                len = str.length;
            return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
        }
    // }

    return function (date, pattern) {
        /**
         * @description : return stringified date according to given pattern.
         * @parameter*  : {date  } date, input Date object
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : fmtDate(date, [pattern])
         * @example     :
        //     '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{lms}Z' => '2013-10-03T00:57::13.180Z'
        //     '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}'        => '2013-10-03 00:57::13'
        //     '{YY}-{M}-{D} {h}:{m}:{s}'               => '13-10-3 0:57::13'
         */

        var y  = date.getFullYear() + '',
            mo = date.getMonth() + 1,
            d  = date.getDate(),
            h  = date.getHours(),
            mi = date.getMinutes(),
            s  = date.getSeconds(),
            ms = date.getMilliseconds();
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';

        return pattern
            .replace( '{YYYY}', y              )
            .replace( '{MM}'  , f(mo)          )
            .replace( '{DD}'  , f(d )          )
            .replace( '{hh}'  , f(h )          )
            .replace( '{mm}'  , f(mi)          )
            .replace( '{ss}'  , f(s )          )
            .replace( '{lms}' , lms(ms)        )
            .replace( '{YY}'  , y.substring(2) )
            .replace( '{M}'   , mo             )
            .replace( '{D}'   , d              )
            .replace( '{h}'   , h              )
            .replace( '{m}'   , mi             )
            .replace( '{s}'   , s              )
            .replace( '{ms}'  , ms             );
    };
});
