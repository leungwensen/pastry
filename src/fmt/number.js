/* jshint strict: true, undef: true, unused: true */
/* global define */
define('fmt/number', [
    // 'pastry'
], function(
    // pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - date
     */

    return function (num, option) {
        /**
         * @description : return stringified number according to given pattern.
         * @param       : {object} option, defines pattern for stringify.
         * @example     : {"comma": "1|0", "decimal": ">=0", "integer" : ">=0", "zero": "1|0"}
         * @return      : {string} result string.
         * @syntax      : number.stringf([option])
         */

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
    };
});
