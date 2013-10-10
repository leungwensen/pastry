/**
 * @description : extend for Number
 * @filename    : brick.number.js
 * @requires    : [brick.js]
 */
'use strict';

(function (BR, undefined) {
    BR.number = BR.number || Number;

    /**
     * @description : return stringified number according to given pattern.
     * @parameters  : {object} option, defines pattern for stringify.
     *                    {
     *                        comma   : {1|0},
     *                        decimal : {0-9},
     *                        integer : {0-9},
     *                        zero    : {1|0},
     *                    }
     * @return      : {string} result string.
     * @syntax      : number.toFormatString([option])
     */
    BR.number.prototype.toFormatString = BR.number.prototype.toFormatString || function (option) {
        var i, len, placeHolder,
            str = this.toString(),
            strArr = str.split('.');
        option = option || {
            'comma'   : 1,
            'decimal' : 2,
            'integer' : 5,
            'zero'    : 0
        };
        placeHolder = (option.hasOwnProperty('zero') && option.zero !== 0) ? '0' : ' ';
        if (option.hasOwnProperty('decimal')) {
            strArr[1] = strArr[1] || '';
            strArr[1] = strArr[1].slice(0, option.decimal);
            len = option.decimal - strArr[1].length;
            for (i = 0; i < len; i ++) {
                strArr[1] += '0';
            }
        }
        if (option.hasOwnProperty('integer')) {
            len = option.integer - strArr[0].length;
            for (i = 0; i < len; i ++) {
                strArr[0] = placeHolder + strArr[0];
            }
        }
        if (option.hasOwnProperty('comma') && option.comma !== 0) {
            strArr[0] = strArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        if (strArr[1] !== '') {
            return strArr.join('.');
        }
        return strArr[0];
    };
}(BR));
