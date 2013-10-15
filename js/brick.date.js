/**
 * @description : extend for Date
 * @filename    : brick.date.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR) {
    BR.date = BR.date || Date;

    var padZero = function (n) {
        return (n < 10 ? '0' : '') + n;
    };
    /**
     * @description : return stringified date according to given pattern.
     * @param       : {string} pattern, defines pattern for stringify.
     * @return      : {string} result string.
     * @syntax      : date.toFormatString([pattern])
     * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
     * @example     : '{YY}-{M}-{D} {h}:{m}:{s}'        => '2013-10-3 0:57::13'
     */
    BR.date.prototype.toFormatString = BR.date.prototype.toFormatString || function (pattern) {
        var y, mo, d, h, mi, s;
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
        return pattern.replace( '{YYYY}', y = String(this.getFullYear())  )
                      .replace( '{MM}'  , padZero(mo = this.getMonth())   )
                      .replace( '{DD}'  , padZero(d  = this.getDate())    )
                      .replace( '{hh}'  , padZero(h  = this.getHours())   )
                      .replace( '{mm}'  , padZero(mi = this.getMinutes()) )
                      .replace( '{ss}'  , padZero(s  = this.getSeconds()) )
                      .replace( '{YY}'  , y.substring(2) )
                      .replace( '{M}'   , mo )
                      .replace( '{D}'   , d  )
                      .replace( '{h}'   , h  )
                      .replace( '{m}'   , mi )
                      .replace( '{s}'   , s  );
    };
}(BR));
