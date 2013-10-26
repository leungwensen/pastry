/**
 * @description : extend for Date
 * @filename    : pastry.date.js
 * @requires    : []
 */
'use strict';

(function () {
    var p = Date.prototype,
        f = function (n) {
            return n < 10 ? '0' + n : n;
        };
    /**
     * @description : return stringified date according to given pattern.
     * @param       : {string} pattern, defines pattern for stringify.
     * @return      : {string} result string.
     * @syntax      : date.stringf([pattern])
     * @example     : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}' => '2013-10-03 00:57::13'
     * @example     : '{YY}-{M}-{D} {h}:{m}:{s}'        => '13-10-3 0:57::13'
     */
    p.stringf = p.stringf || function (pattern) {
        var y, mo, d, h, mi, s;
        pattern = pattern || '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}';
        return pattern.replace( '{YYYY}', y = String(this.getFullYear()) )
                      .replace( '{MM}'  , f(mo = this.getMonth()  ) )
                      .replace( '{DD}'  , f(d  = this.getDate()   ) )
                      .replace( '{hh}'  , f(h  = this.getHours()  ) )
                      .replace( '{mm}'  , f(mi = this.getMinutes()) )
                      .replace( '{ss}'  , f(s  = this.getSeconds()) )
                      .replace( '{YY}'  , y.substring(2) )
                      .replace( '{M}'   , mo )
                      .replace( '{D}'   , d  )
                      .replace( '{h}'   , h  )
                      .replace( '{m}'   , mi )
                      .replace( '{s}'   , s  );
    };
}());
